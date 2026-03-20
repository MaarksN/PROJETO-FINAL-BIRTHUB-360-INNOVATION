// [SOURCE] CI-TS-004
// Local shim to keep dashboard typecheck stable while Supabase SDK wiring is optional in this workspace.
declare module "@supabase/supabase-js" {
  export function createClient(url: string, key: string): {
    auth: {
      onAuthStateChange(
        callback: (event: string, session: { user?: unknown } | null) => void
      ): { data: { subscription: { unsubscribe: () => void } } };
      signInWithOAuth(input: { provider: string }): Promise<unknown>;
      signOut(): Promise<unknown>;
    };
  };
}
