/* eslint-disable complexity, max-lines */
"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Briefcase,
  CheckSquare,
  Copy,
  Crown,
  Eye,
  Flame,
  Globe,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  LifeBuoy,
  ListPlus,
  Loader2,
  MailCheck,
  Megaphone,
  MessageCircle,
  Mic,
  PenTool,
  PhoneIncoming,
  ScanSearch,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  UserX,
  Users,
  X,
  Zap
} from "lucide-react";

import type {
  SalesOsChatMessage,
  SalesOsModuleDefinition,
  SalesOsModuleId,
  SalesOsTool
} from "../../lib/sales-os/types";
import styles from "./sales-os.module.css";

type SalesOsShellCopy = {
  catalogLoading: string;
  copied: string;
  copyOutput: string;
  emptySearchDescription: string;
  emptySearchTitle: string;
  emptyWorkspaceDescription: string;
  emptyWorkspaceTitle: string;
  imageBriefHint: string;
  mentorDescription: string;
  mentorGreeting: string;
  mentorInputPlaceholder: string;
  mentorTitle: string;
  micUnsupported: string;
  moduleSearchPlaceholder: string;
  noImageSelected: string;
  openMentor: string;
  outputEmpty: string;
  outputTitle: string;
  removeImage: string;
  roleplayInputPlaceholder: string;
  running: string;
  runProtocol: string;
  send: string;
  toolSearchPlaceholder: string;
  uploadImage: string;
  visionHint: string;
};

type CatalogResponse = {
  modules: SalesOsModuleDefinition[];
  tools: SalesOsTool[];
};

const iconMap = {
  activity: Activity,
  "bar-chart": BarChart3,
  briefcase: Briefcase,
  "check-square": CheckSquare,
  crown: Crown,
  eye: Eye,
  flame: Flame,
  globe: Globe,
  image: ImageIcon,
  layers: Layers,
  "life-buoy": LifeBuoy,
  "list-plus": ListPlus,
  "mail-check": MailCheck,
  megaphone: Megaphone,
  "pen-tool": PenTool,
  "phone-incoming": PhoneIncoming,
  "scan-search": ScanSearch,
  shield: Shield,
  "shield-alert": ShieldAlert,
  target: Target,
  "user-x": UserX,
  users: Users,
  zap: Zap
} as const;

const paletteMap: Record<string, { glow: string; soft: string; solid: string }> = {
  amber: { glow: "rgba(245, 158, 11, 0.3)", soft: "rgba(245, 158, 11, 0.12)", solid: "#f59e0b" },
  blue: { glow: "rgba(59, 130, 246, 0.3)", soft: "rgba(59, 130, 246, 0.12)", solid: "#3b82f6" },
  "brand-gold": {
    glow: "rgba(245, 158, 11, 0.3)",
    soft: "rgba(245, 158, 11, 0.12)",
    solid: "#f59e0b"
  },
  cyan: { glow: "rgba(6, 182, 212, 0.3)", soft: "rgba(6, 182, 212, 0.12)", solid: "#06b6d4" },
  emerald: {
    glow: "rgba(16, 185, 129, 0.3)",
    soft: "rgba(16, 185, 129, 0.12)",
    solid: "#10b981"
  },
  green: { glow: "rgba(34, 197, 94, 0.3)", soft: "rgba(34, 197, 94, 0.12)", solid: "#22c55e" },
  indigo: {
    glow: "rgba(99, 102, 241, 0.3)",
    soft: "rgba(99, 102, 241, 0.12)",
    solid: "#6366f1"
  },
  orange: {
    glow: "rgba(249, 115, 22, 0.3)",
    soft: "rgba(249, 115, 22, 0.12)",
    solid: "#f97316"
  },
  pink: { glow: "rgba(236, 72, 153, 0.3)", soft: "rgba(236, 72, 153, 0.12)", solid: "#ec4899" },
  purple: {
    glow: "rgba(168, 85, 247, 0.3)",
    soft: "rgba(168, 85, 247, 0.12)",
    solid: "#a855f7"
  },
  red: { glow: "rgba(239, 68, 68, 0.3)", soft: "rgba(239, 68, 68, 0.12)", solid: "#ef4444" },
  rose: { glow: "rgba(244, 63, 94, 0.3)", soft: "rgba(244, 63, 94, 0.12)", solid: "#f43f5e" },
  sky: { glow: "rgba(14, 165, 233, 0.3)", soft: "rgba(14, 165, 233, 0.12)", solid: "#0ea5e9" }
};

const defaultPalette = {
  glow: "rgba(99, 102, 241, 0.3)",
  soft: "rgba(99, 102, 241, 0.12)",
  solid: "#6366f1"
};

function resolveIcon(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] ?? Sparkles;
}

function accentStyle(color: string): CSSProperties {
  const palette = paletteMap[color] ?? defaultPalette;
  return {
    "--sales-glow": palette.glow,
    "--sales-soft": palette.soft,
    "--sales-solid": palette.solid
  } as CSSProperties;
}

function buildMentorGreeting(copy: SalesOsShellCopy, moduleTitle: string) {
  return `${copy.mentorGreeting} ${moduleTitle}.`;
}

function speakReply(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || text.length > 320) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);
}

async function readImageAsPayload(file: File) {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.onload = () => {
      const { result } = reader;
      if (typeof result !== "string") {
        reject(new Error("Unable to read the selected file."));
        return;
      }

      const value = result;
      resolve(value.split(",")[1] ?? "");
    };
    reader.readAsDataURL(file);
  });

  return {
    data,
    mimeType: file.type,
    name: file.name
  };
}

function startVoiceCapture(
  onResult: (transcript: string) => void,
  copy: SalesOsShellCopy
) {
  const Recognition =
    typeof window === "undefined"
      ? null
      : (window as typeof window & {
          SpeechRecognition?: new () => {
            lang: string;
            onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
            start: () => void;
          };
          webkitSpeechRecognition?: new () => {
            lang: string;
            onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
            start: () => void;
          };
        }).SpeechRecognition ??
        (window as typeof window & {
          webkitSpeechRecognition?: new () => {
            lang: string;
            onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
            start: () => void;
          };
        }).webkitSpeechRecognition;

  if (!Recognition) {
    window.alert(copy.micUnsupported);
    return;
  }

  const recognition = new Recognition();
  recognition.lang = "pt-BR";
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript ?? "";
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
  };
  recognition.start();
}

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
