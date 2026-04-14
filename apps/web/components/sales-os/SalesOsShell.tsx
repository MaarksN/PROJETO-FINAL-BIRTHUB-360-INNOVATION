/* eslint-disable complexity, max-lines */
// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Copy,
  ImagePlus,
  Loader2,
  MessageCircle,
  Mic,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import type {
  SalesOsChatMessage,
  SalesOsModuleDefinition,
  SalesOsModuleId,
  SalesOsTool
} from "../../lib/sales-os/types";
import {
  accentStyle,
  buildMentorGreeting,
  readImageAsPayload,
  resolveIcon,
  speakReply,
  startVoiceCapture,
  type CatalogResponse,
  type SalesOsShellCopy
} from "./shell-support";
import styles from "./sales-os.module.css";

export function SalesOsShell(input: { copy: SalesOsShellCopy }) {
  const { copy } = input;
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [modules, setModules] = useState<SalesOsModuleDefinition[]>([]);
  const [tools, setTools] = useState<SalesOsTool[]>([]);
  const [selectedModule, setSelectedModule] = useState<SalesOsModuleId>("sales");
  const [moduleSearch, setModuleSearch] = useState("");
  const [toolSearch, setToolSearch] = useState("");
  const [selectedToolId, setSelectedToolId] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<{
    data: string;
    mimeType: string;
    name?: string;
  } | null>(null);
  const [runLoading, setRunLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [outputProvider, setOutputProvider] = useState("");
  const [copyState, setCopyState] = useState<"copied" | "idle">("idle");
  const [roleplayMessages, setRoleplayMessages] = useState<SalesOsChatMessage[]>([]);
  const [roleplayInput, setRoleplayInput] = useState("");
  const [roleplayLoading, setRoleplayLoading] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<SalesOsChatMessage[]>([]);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch("/api/sales-os/catalog", {
          cache: "no-store"
        });
        const payload = (await response.json()) as CatalogResponse;
        setModules(payload.modules);
        setTools(payload.tools);
      } finally {
        setCatalogLoading(false);
      }
    }

    void loadCatalog();
  }, []);

  const availableModules = modules.filter((moduleDefinition) => {
    const haystack = `${moduleDefinition.title} ${moduleDefinition.subtitle} ${moduleDefinition.description}`.toLowerCase();
    return haystack.includes(moduleSearch.toLowerCase());
  });

  const moduleCounts = modules.reduce<Record<string, number>>((accumulator, moduleDefinition) => {
    accumulator[moduleDefinition.id] = tools.filter((tool) =>
      tool.modules.includes(moduleDefinition.id)
    ).length;
    return accumulator;
  }, {});

  const visibleTools = tools.filter((tool) => {
    if (!tool.modules.includes(selectedModule)) {
      return false;
    }

    const haystack = `${tool.name} ${tool.desc} ${tool.prompt}`.toLowerCase();
    return haystack.includes(toolSearch.toLowerCase());
  });

  const selectedTool =
    visibleTools.find((tool) => tool.id === selectedToolId) ??
    tools.find((tool) => tool.id === selectedToolId && tool.modules.includes(selectedModule)) ??
    visibleTools[0];

  useEffect(() => {
    if (selectedTool?.id && selectedTool.id !== selectedToolId) {
      setSelectedToolId(selectedTool.id);
    }
  }, [selectedTool?.id, selectedToolId]);

  useEffect(() => {
    if (!selectedTool) {
      return;
    }

    setFormValues({});
    setSelectedImage(null);
    setOutput("");
    setOutputProvider("");
    setRoleplayInput("");
    setRoleplayMessages(
      selectedTool.isChat && selectedTool.firstMsg
        ? [{ role: "assistant", text: selectedTool.firstMsg }]
        : []
    );
  }, [selectedTool?.id]);

  useEffect(() => {
    const currentModuleDefinition = modules.find((moduleDefinition) => moduleDefinition.id === selectedModule);
    setMentorMessages(
      currentModuleDefinition
        ? [{ role: "assistant", text: buildMentorGreeting(copy, currentModuleDefinition.title) }]
        : []
    );
    setMentorInput("");
  }, [copy, modules, selectedModule]);

  async function handleRunTool() {
    if (!selectedTool || selectedTool.isChat) {
      return;
    }

    setRunLoading(true);

    try {
      const response = await fetch("/api/sales-os/execute", {
        body: JSON.stringify({
          fields: formValues,
          image: selectedImage,
          toolId: selectedTool.id
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload = (await response.json()) as {
        error?: string;
        output?: string;
        provider?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Sales OS execution failed.");
      }

      setOutput(payload.output ?? "");
      setOutputProvider(payload.provider ?? "");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Unexpected Sales OS execution error.");
      setOutputProvider("error");
    } finally {
      setRunLoading(false);
    }
  }

  async function handleRoleplaySend() {
    if (!selectedTool || !selectedTool.isChat || !roleplayInput.trim()) {
      return;
    }

    const userText = roleplayInput.trim();
    const nextHistory = [...roleplayMessages, { role: "user" as const, text: userText }];
    setRoleplayMessages(nextHistory);
    setRoleplayInput("");
    setRoleplayLoading(true);

    try {
      const response = await fetch("/api/sales-os/chat", {
        body: JSON.stringify({
          currentModule: selectedModule,
          history: nextHistory,
          input: userText,
          toolId: selectedTool.id
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload = (await response.json()) as {
        error?: string;
        output?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Roleplay execution failed.");
      }

      const assistantReply = payload.output ?? "";
      setRoleplayMessages((current) => [...current, { role: "assistant", text: assistantReply }]);
      speakReply(assistantReply);
    } catch (error) {
      setRoleplayMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "Unexpected Sales OS chat error."
        }
      ]);
    } finally {
      setRoleplayLoading(false);
    }
  }

  async function handleMentorSend() {
    if (!mentorInput.trim()) {
      return;
    }

    const userText = mentorInput.trim();
    const nextHistory = [...mentorMessages, { role: "user" as const, text: userText }];
    setMentorMessages(nextHistory);
    setMentorInput("");
    setMentorLoading(true);

    try {
      const response = await fetch("/api/sales-os/chat", {
        body: JSON.stringify({
          currentModule: selectedModule,
          history: nextHistory,
          input: userText,
          mentor: true
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload = (await response.json()) as {
        error?: string;
        output?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Mentor execution failed.");
      }

      const assistantReply = payload.output ?? "";
      setMentorMessages((current) => [...current, { role: "assistant", text: assistantReply }]);
      speakReply(assistantReply);
    } catch (error) {
      setMentorMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "Unexpected mentor error."
        }
      ]);
    } finally {
      setMentorLoading(false);
    }
  }

  async function handleCopyOutput() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopyState("copied");
    window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);
  }

  if (catalogLoading) {
    return <section className="panel">{copy.catalogLoading}</section>;
  }

  return (
    <>
      <section className={styles.overview}>
        <div className={styles.searchCard}>
          <Search size={16} />
          <input
            onChange={(event) => setModuleSearch(event.target.value)}
            placeholder={copy.moduleSearchPlaceholder}
            type="search"
            value={moduleSearch}
          />
        </div>

        <div className={styles.moduleGrid}>
          {availableModules.map((moduleDefinition) => {
            const Icon = resolveIcon(moduleDefinition.icon);
            const active = moduleDefinition.id === selectedModule;
            return (
              <button
                className={styles.moduleCard}
                data-active={active ? "true" : "false"}
                key={moduleDefinition.id}
                onClick={() => setSelectedModule(moduleDefinition.id)}
                style={accentStyle(tools.find((tool) => tool.modules.includes(moduleDefinition.id))?.color ?? "indigo")}
                type="button"
              >
                <div className={styles.moduleCardHeader}>
                  <span className={styles.moduleIconWrap}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.moduleCount}>{moduleCounts[moduleDefinition.id] ?? 0}</span>
                </div>
                <strong>{moduleDefinition.title}</strong>
                <span>{moduleDefinition.subtitle}</span>
                <p>{moduleDefinition.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.toolRail}>
          <div className={styles.railHeader}>
            <strong>{modules.find((moduleDefinition) => moduleDefinition.id === selectedModule)?.title}</strong>
            <span>{visibleTools.length} tools</span>
          </div>

          <div className={styles.searchCard}>
            <Search size={16} />
            <input
              onChange={(event) => setToolSearch(event.target.value)}
              placeholder={copy.toolSearchPlaceholder}
              type="search"
              value={toolSearch}
            />
          </div>

          <div className={styles.toolList}>
            {visibleTools.length === 0 ? (
              <article className={styles.emptyCard}>
                <strong>{copy.emptySearchTitle}</strong>
                <p>{copy.emptySearchDescription}</p>
              </article>
            ) : (
              visibleTools.map((tool) => {
                const Icon = resolveIcon(tool.icon);
                return (
                  <button
                    className={styles.toolCard}
                    data-active={tool.id === selectedTool?.id ? "true" : "false"}
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    style={accentStyle(tool.color)}
                    type="button"
                  >
                    <div className={styles.toolCardHeader}>
                      <span className={styles.toolIconWrap}>
                        <Icon size={16} />
                      </span>
                      <span>{tool.emoji}</span>
                    </div>
                    <strong>{tool.name}</strong>
                    <p>{tool.desc}</p>
                    <div className={styles.toolPills}>
                      {tool.isChat ? <span>Chat</span> : null}
                      {tool.acceptsImage ? <span>Vision</span> : null}
                      {tool.isImage ? <span>Image Brief</span> : null}
                      {tool.useSearch ? <span>Research</span> : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className={styles.board}>
          {!selectedTool ? (
            <article className={styles.emptyWorkspace}>
              <strong>{copy.emptyWorkspaceTitle}</strong>
              <p>{copy.emptyWorkspaceDescription}</p>
            </article>
          ) : (
            <>
              <header className={styles.boardHeader} style={accentStyle(selectedTool.color)}>
                <div>
                  <span className={styles.boardEyebrow}>
                    {modules.find((moduleDefinition) => moduleDefinition.id === selectedModule)?.title}
                  </span>
                  <h2>{selectedTool.name}</h2>
                  <p>{selectedTool.desc}</p>
                </div>
                <div className={styles.boardMeta}>
                  {selectedTool.acceptsImage ? <span>{copy.visionHint}</span> : null}
                  {selectedTool.isImage ? <span>{copy.imageBriefHint}</span> : null}
                  {outputProvider ? <span>{outputProvider}</span> : null}
                </div>
              </header>

              {selectedTool.isChat ? (
                <section className={styles.chatBoard}>
                  <div className={styles.chatTranscript}>
                    {roleplayMessages.map((message, index) => (
                      <article
                        className={styles.chatBubble}
                        data-role={message.role}
                        key={`${message.role}-${index}-${message.text.slice(0, 16)}`}
                      >
                        <strong>{message.role === "assistant" ? selectedTool.name : "Voce"}</strong>
                        <p>{message.text}</p>
                      </article>
                    ))}
                    {roleplayLoading ? (
                      <article className={styles.chatBubble} data-role="assistant">
                        <strong>{selectedTool.name}</strong>
                        <p>{copy.running}</p>
                      </article>
                    ) : null}
                  </div>

                  <div className={styles.chatComposer}>
                    <button
                      className={styles.iconButton}
                      onClick={() => {
                        startVoiceCapture(setRoleplayInput, copy);
                      }}
                      type="button"
                    >
                      <Mic size={16} />
                    </button>
                    <input
                      onChange={(event) => setRoleplayInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void handleRoleplaySend();
                        }
                      }}
                      placeholder={copy.roleplayInputPlaceholder}
                      type="text"
                      value={roleplayInput}
                    />
                    <button
                      className={styles.primaryButton}
                      disabled={roleplayLoading}
                      onClick={() => {
                        void handleRoleplaySend();
                      }}
                      type="button"
                    >
                      <Send size={16} />
                      <span>{copy.send}</span>
                    </button>
                  </div>
                </section>
              ) : (
                <section className={styles.executionGrid}>
                  <article className={styles.formPanel}>
                    <div className={styles.sectionTitleRow}>
                      <strong>Inputs</strong>
                      <span>{selectedTool.fields?.length ?? 1}</span>
                    </div>

                    <div className={styles.fieldStack}>
                      {(selectedTool.fields ?? [
                        {
                          id: "context",
                          label: "Contexto",
                          placeholder: "Descreva o cenário, a conta e o objetivo.",
                          type: "textarea"
                        }
                      ]).map((field) => (
                        <label className={styles.field} key={field.id}>
                          <span>{field.label}</span>
                          {field.type === "textarea" ? (
                            <textarea
                              onChange={(event) =>
                                setFormValues((current) => ({
                                  ...current,
                                  [field.id]: event.target.value
                                }))
                              }
                              placeholder={field.placeholder}
                              value={formValues[field.id] ?? ""}
                            />
                          ) : field.type === "select" ? (
                            <select
                              onChange={(event) =>
                                setFormValues((current) => ({
                                  ...current,
                                  [field.id]: event.target.value
                                }))
                              }
                              value={formValues[field.id] ?? ""}
                            >
                              <option value="">Selecione</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              onChange={(event) =>
                                setFormValues((current) => ({
                                  ...current,
                                  [field.id]: event.target.value
                                }))
                              }
                              placeholder={field.placeholder}
                              type="text"
                              value={formValues[field.id] ?? ""}
                            />
                          )}
                        </label>
                      ))}
                    </div>

                    {selectedTool.acceptsImage ? (
                      <div className={styles.uploadBox}>
                        <label className={styles.uploadLabel}>
                          <ImagePlus size={16} />
                          <span>{selectedImage?.name ?? copy.uploadImage}</span>
                          <input
                            accept="image/*"
                            className={styles.hiddenInput}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) {
                                return;
                              }

                              void readImageAsPayload(file).then(setSelectedImage);
                            }}
                            type="file"
                          />
                        </label>
                        <small>{selectedImage?.name ?? copy.noImageSelected}</small>
                        {selectedImage ? (
                          <button
                            className={styles.secondaryButton}
                            onClick={() => setSelectedImage(null)}
                            type="button"
                          >
                            {copy.removeImage}
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    <button
                      className={styles.runButton}
                      disabled={runLoading}
                      onClick={() => {
                        void handleRunTool();
                      }}
                      style={accentStyle(selectedTool.color)}
                      type="button"
                    >
                      {runLoading ? <Loader2 className={styles.spin} size={16} /> : <Sparkles size={16} />}
                      <span>{runLoading ? copy.running : copy.runProtocol}</span>
                    </button>
                  </article>

                  <article className={styles.outputPanel}>
                    <div className={styles.sectionTitleRow}>
                      <strong>{copy.outputTitle}</strong>
                      <button className={styles.iconButton} onClick={() => void handleCopyOutput()} type="button">
                        <Copy size={16} />
                        <span>{copyState === "copied" ? copy.copied : copy.copyOutput}</span>
                      </button>
                    </div>

                    <div className={styles.outputBody}>
                      {output ? <pre>{output}</pre> : <p>{copy.outputEmpty}</p>}
                    </div>
                  </article>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <button
        className={styles.mentorToggle}
        onClick={() => setMentorOpen((current) => !current)}
        type="button"
      >
        {mentorOpen ? <X size={18} /> : <MessageCircle size={18} />}
        <span>{copy.openMentor}</span>
      </button>

      {mentorOpen ? (
        <aside className={styles.mentorPanel}>
          <div className={styles.mentorHeader}>
            <div>
              <strong>{copy.mentorTitle}</strong>
              <p>{copy.mentorDescription}</p>
            </div>
            <button className={styles.iconButton} onClick={() => setMentorOpen(false)} type="button">
              <X size={16} />
            </button>
          </div>

          <div className={styles.mentorTranscript}>
            {mentorMessages.map((message, index) => (
              <article
                className={styles.chatBubble}
                data-role={message.role}
                key={`${message.role}-${index}-${message.text.slice(0, 16)}`}
              >
                <strong>{message.role === "assistant" ? copy.mentorTitle : "Voce"}</strong>
                <p>{message.text}</p>
              </article>
            ))}
            {mentorLoading ? (
              <article className={styles.chatBubble} data-role="assistant">
                <strong>{copy.mentorTitle}</strong>
                <p>{copy.running}</p>
              </article>
            ) : null}
          </div>

          <div className={styles.chatComposer}>
            <button
              className={styles.iconButton}
              onClick={() => {
                startVoiceCapture(setMentorInput, copy);
              }}
              type="button"
            >
              <Mic size={16} />
            </button>
            <input
              onChange={(event) => setMentorInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleMentorSend();
                }
              }}
              placeholder={copy.mentorInputPlaceholder}
              type="text"
              value={mentorInput}
            />
            <button
              className={styles.primaryButton}
              disabled={mentorLoading}
              onClick={() => {
                void handleMentorSend();
              }}
              type="button"
            >
              <Bot size={16} />
              <span>{copy.send}</span>
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
