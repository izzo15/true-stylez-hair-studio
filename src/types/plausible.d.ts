declare namespace Plausible {
  interface Options {
    callback?: () => void
    url?: string
    domain?: string
  }

  interface EventOptions {
    props?: Record<string, unknown>
  }
}

declare global {
  interface Window {
    plausible(event: string, options?: Plausible.EventOptions): void
    plausible(method: string, event: string, options?: Plausible.EventOptions): void
    plausible(method: string, options?: Plausible.EventOptions): void
  }
}

export {}