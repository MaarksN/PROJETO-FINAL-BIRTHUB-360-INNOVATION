import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToString } from "react-dom/server";

void test("sdr automatic platform renders the Portuguese default workspace", async () => {
  const { SdrAutomaticPlatform } = await import("../components/sales-os/SdrAutomaticPlatform.js");
  const markup = renderToString(
    React.createElement(SdrAutomaticPlatform, {
      locale: "pt-BR"
    })
  );

  assert.match(markup, /BirthHub 360 SDR Automatic/);
  assert.match(markup, /Co-piloto: Lead Score Preditivo/);
  assert.match(markup, /Julia Andrade/);
  assert.match(markup, /Plataforma SDR/);
  assert.match(markup, /Critica/);
});

void test("sdr automatic platform renders localized English labels", async () => {
  const { SdrAutomaticPlatform } = await import("../components/sales-os/SdrAutomaticPlatform.js");
  const markup = renderToString(
    React.createElement(SdrAutomaticPlatform, {
      locale: "en-US"
    })
  );

  assert.match(markup, /BirthHub 360 SDR Automatic/);
  assert.match(markup, /Co-pilot: Predictive Lead Score/);
  assert.match(markup, /SDR Platform/);
  assert.match(markup, /Critical leads/);
  assert.match(markup, /Call now/);
});
