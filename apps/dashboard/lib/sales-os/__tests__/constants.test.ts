import { describe, it, expect } from 'vitest';
import { TOOLS } from '../constants';
// [SOURCE] apps/dashboard/README.md — LDR item / AE item

describe('Sales OS Constants', () => {
  it('should have unique IDs for all tools', () => {
    const ids = TOOLS.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have required fields for List Builder tool', () => {
    const tool = TOOLS.find(t => t.id === 'ldr_list');
    expect(tool).toBeDefined();
    const fieldIds = tool?.fields?.map(f => f.id);
    expect(fieldIds).toContain('employees');
    expect(fieldIds).toContain('funding');
  });

  it('should have required fields for Cold Call Sim tool', () => {
    const tool = TOOLS.find(t => t.id === 'sdr_coldcall');
    expect(tool).toBeDefined();
    const fieldIds = tool?.fields?.map(f => f.id);
    expect(fieldIds).toContain('rebuttal');
  });

  it('should expose LDR handoff and roleplay tools', () => {
    const ldrHandoff = TOOLS.find(t => t.id === 'ldr_handoff');
    const ldrRoleplay = TOOLS.find(t => t.id === 'roleplay_ldr_gatekeeper');
    expect(ldrHandoff?.modules).toContain('ldr');
    expect(ldrRoleplay?.modules).toContain('ldr');
    expect(ldrRoleplay?.isChat).toBe(true);
  });

  it('should expose AE proposal and ROI tools', () => {
    const proposal = TOOLS.find(t => t.id === 'ae_proposal_generator');
    const roi = TOOLS.find(t => t.id === 'ae_roi_calculator');
    expect(proposal?.modules).toContain('ae');
    expect(roi?.modules).toContain('ae');
  });
});
