import { Component, Input, ViewEncapsulation } from '@angular/core';

export type IconName =
  | 'bank' | 'wallet' | 'deposit' | 'withdraw' | 'transfer' | 'invest'
  | 'chart' | 'key' | 'receipt' | 'user' | 'lock' | 'mail' | 'phone' | 'id'
  | 'eye' | 'eye-off' | 'logout' | 'plus' | 'check' | 'check-circle'
  | 'close' | 'chevron-right' | 'chevron-left' | 'arrow-left' | 'arrow-down'
  | 'arrow-up' | 'shield' | 'copy' | 'trash' | 'edit' | 'bell' | 'settings'
  | 'users' | 'clock' | 'camera' | 'sparkle' | 'pix' | 'dice' | 'info' | 'search';

/**
 * Ícone SVG de traço único (estilo Lucide), tamanho e cor controlados por tokens.
 * Substitui todos os emojis do projeto. Usa currentColor para herdar a cor do contexto.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
<svg
  [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" [attr.stroke-width]="strokeWidth"
  stroke-linecap="round" stroke-linejoin="round" class="app-icon"
  [attr.aria-hidden]="label ? null : 'true'" [attr.role]="label ? 'img' : null" [attr.aria-label]="label">
  @switch (name) {
    @case ('bank') { <path d="M3 21h18M4 10h16M5 21V10M19 21V10M9 21V10M15 21V10M12 3 4 7h16Z"/> }
    @case ('wallet') { <path d="M3 7a2 2 0 0 1 2-2h12.5a1.5 1.5 0 0 1 0 3H5"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7H5"/><circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none"/> }
    @case ('deposit') { <path d="M12 4v10"/><path d="m7 11 5 4 5-4"/><path d="M5 20h14"/> }
    @case ('withdraw') { <path d="M12 20V10"/><path d="m7 13 5-4 5 4"/><path d="M5 4h14"/> }
    @case ('transfer') { <path d="M4 8h13"/><path d="m13 4 4 4-4 4"/><path d="M20 16H7"/><path d="m11 20-4-4 4-4"/> }
    @case ('pix') { <path d="M12 3 5 10l7 7 7-7-7-7Z"/><path d="m9 7 3 3 3-3M9 13l3-3 3 3" opacity="0"/> }
    @case ('invest') { <path d="M3 17 9 11l4 4 8-8"/><path d="M21 7v5h-5"/> }
    @case ('chart') { <path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="13" y="7" width="3" height="10" rx="1"/> }
    @case ('key') { <circle cx="8" cy="14" r="4"/><path d="m11 11 9-9"/><path d="m17 4 2 2"/><path d="m15 6 2 2"/> }
    @case ('receipt') { <path d="M5 3v18l2-1.4L9 21l2-1.4L13 21l2-1.4L17 21l2-1.4V3l-2 1.4L15 3l-2 1.4L11 3 9 4.4 7 3Z"/><path d="M8 8h8M8 12h8M8 16h5"/> }
    @case ('user') { <circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/> }
    @case ('users') { <circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7"/><path d="M18 20a6 6 0 0 0-3-5.2"/> }
    @case ('lock') { <rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/> }
    @case ('mail') { <rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/> }
    @case ('phone') { <path d="M7 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" opacity="0"/><path d="M6.5 3h3l1.8 4.5L9 9.2a12 12 0 0 0 5.8 5.8l1.7-2.3L21 14.5v3.2a2.3 2.3 0 0 1-2.5 2.3A16.5 16.5 0 0 1 4 5.5 2.3 2.3 0 0 1 6.3 3Z"/> }
    @case ('id') { <rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16a3 3 0 0 1 6 0"/><path d="M14 10h4M14 13.5h4"/> }
    @case ('eye') { <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/> }
    @case ('eye-off') { <path d="M3 3l18 18"/><path d="M10.6 6.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.4 4.1"/><path d="M6.2 7.4A17 17 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 4-.8"/><path d="M9.5 10.5a3 3 0 0 0 4 4"/> }
    @case ('logout') { <path d="M14 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 12H10"/><path d="m13 8 4 4-4 4"/> }
    @case ('plus') { <path d="M12 5v14M5 12h14"/> }
    @case ('check') { <path d="m4 12 5 5L20 6"/> }
    @case ('check-circle') { <circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5L16 9.5"/> }
    @case ('close') { <path d="M6 6l12 12M18 6 6 18"/> }
    @case ('chevron-right') { <path d="m9 6 6 6-6 6"/> }
    @case ('chevron-left') { <path d="m15 6-6 6 6 6"/> }
    @case ('arrow-left') { <path d="M20 12H5"/><path d="m11 6-6 6 6 6"/> }
    @case ('arrow-down') { <path d="M12 5v14"/><path d="m6 13 6 6 6-6"/> }
    @case ('arrow-up') { <path d="M12 19V5"/><path d="m6 11 6-6 6 6"/> }
    @case ('shield') { <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z"/><path d="m9 12 2 2 4-4"/> }
    @case ('copy') { <rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/> }
    @case ('trash') { <path d="M4 7h16"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"/><path d="M10 11v6M14 11v6"/> }
    @case ('edit') { <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/> }
    @case ('bell') { <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/> }
    @case ('settings') { <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/> }
    @case ('clock') { <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/> }
    @case ('camera') { <path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/> }
    @case ('sparkle') { <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/> }
    @case ('dice') { <rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none"/> }
    @case ('info') { <circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none"/> }
    @case ('search') { <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/> }
    @default { <circle cx="12" cy="12" r="9"/> }
  }
</svg>
  `,
  styles: [`.app-icon { display: inline-block; vertical-align: middle; flex: none; }`],
})
export class IconComponent {
  @Input() name: IconName = 'info';
  @Input() size: number | string = 24;
  @Input() strokeWidth: number | string = 1.8;
  @Input() label = '';
}
