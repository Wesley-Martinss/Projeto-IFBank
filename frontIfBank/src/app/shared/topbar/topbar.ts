import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon';

/**
 * Barra superior compartilhada do app.
 * Apresentacional: recebe dados por @Input e emite ações por @Output.
 * Não conhece serviços nem regra de negócio — cada página liga aos seus métodos.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
<header class="tb">
  <div class="tb__inner">
    <div class="tb__left">
      @if (showBack) {
        <button type="button" class="tb__back" (click)="back.emit()" aria-label="Voltar">
          <app-icon name="arrow-left" [size]="20"></app-icon>
        </button>
      }
      <div class="tb__brand">
        <span class="tb__logo"><app-icon name="bank" [size]="20"></app-icon></span>
        <span class="tb__name">IF<strong>Bank</strong></span>
      </div>
      @if (title) { <span class="tb__title">{{ title }}</span> }
    </div>

    @if (showAccount) {
      <div class="tb__right">
        @if (tipoUsuario) {
          <span class="ui-badge"
                [class.ui-badge--gold]="tipoUsuario === 'GERENTE'"
                [class.ui-badge--navy]="tipoUsuario !== 'GERENTE'">
            {{ rotuloTipo(tipoUsuario) }}
          </span>
        }

        <button type="button" class="tb__avatar" (click)="avatarClick.emit()"
                [attr.aria-label]="foto ? 'Alterar foto de perfil' : 'Adicionar foto de perfil'">
          @if (foto) {
            <img [src]="foto" alt="Foto de perfil" />
          } @else {
            <app-icon name="camera" [size]="18"></app-icon>
          }
        </button>

        <button type="button" class="tb__icon-btn" (click)="changePassword.emit()" aria-label="Trocar senha">
          <app-icon name="lock" [size]="18"></app-icon>
        </button>
        <button type="button" class="tb__icon-btn tb__icon-btn--danger" (click)="logout.emit()" aria-label="Sair">
          <app-icon name="logout" [size]="18"></app-icon>
        </button>
      </div>
    } @else if (showLogout) {
      <div class="tb__right">
        <button type="button" class="tb__logout" (click)="logout.emit()">
          <app-icon name="logout" [size]="18"></app-icon> <span>Sair</span>
        </button>
      </div>
    }
  </div>
</header>
  `,
  styles: [`
.tb {
  position: sticky; top: 0; z-index: 40;
  background: var(--grad-navy-2);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-top: env(safe-area-inset-top, 0);
  box-shadow: var(--shadow-sm);
}
.tb__inner {
  max-width: var(--container); margin: 0 auto;
  min-height: var(--header-h); padding: 0 var(--s-5);
  display: flex; align-items: center; justify-content: space-between; gap: var(--s-3);
}
.tb__left { display: flex; align-items: center; gap: var(--s-3); min-width: 0; }
.tb__back {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border: none; border-radius: var(--r-sm);
  background: rgba(255,255,255,0.08); color: #fff; cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.tb__back:hover { background: rgba(255,255,255,0.16); }
.tb__brand { display: flex; align-items: center; gap: var(--s-2); }
.tb__logo {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: var(--r-sm);
  background: var(--grad-gold); color: var(--navy-900);
}
.tb__name { font-family: var(--font-display); font-weight: 600; font-size: 1.1rem; color: #fff; letter-spacing: -0.01em; }
.tb__name strong { font-weight: 800; }
.tb__title {
  color: var(--text-on-dark-sec); font-size: 0.95rem; font-weight: 500;
  padding-left: var(--s-3); margin-left: var(--s-1);
  border-left: 1px solid rgba(255,255,255,0.18);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tb__right { display: flex; align-items: center; gap: var(--s-2); }
.tb__avatar {
  width: 40px; height: 40px; border-radius: var(--r-full); overflow: hidden;
  border: 2px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.10);
  color: var(--text-on-dark-sec); cursor: pointer; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  transition: border-color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
}
.tb__avatar:hover { border-color: var(--gold-400); }
.tb__avatar:active { transform: scale(0.96); }
.tb__avatar img { width: 100%; height: 100%; object-fit: cover; }
.tb__icon-btn {
  width: 40px; height: 40px; border: none; border-radius: var(--r-sm);
  background: rgba(255,255,255,0.08); color: var(--text-on-dark); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
}
.tb__icon-btn:hover { background: rgba(255,255,255,0.16); }
.tb__icon-btn--danger:hover { background: rgba(220,38,38,0.85); color: #fff; }
.tb__logout {
  display: inline-flex; align-items: center; gap: 8px;
  height: 40px; padding: 0 var(--s-4); border: none; border-radius: var(--r-sm);
  background: rgba(255,255,255,0.08); color: #fff; font-weight: 600; font-size: 0.9rem; cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.tb__logout:hover { background: rgba(220,38,38,0.85); }

@media (max-width: 560px) {
  .tb__inner { padding: 0 var(--s-4); }
  .tb__title { display: none; }
  .tb__name { font-size: 1rem; }
}
  `],
})
export class TopbarComponent {
  @Input() showBack = false;
  @Input() showAccount = false;
  @Input() showLogout = false;
  @Input() title = '';
  @Input() tipoUsuario: string | null | undefined = null;
  @Input() foto = '';

  @Output() back = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  rotuloTipo(tipo: string): string {
    const map: Record<string, string> = { CLIENTE: 'Cliente', GERENTE: 'Gerente', ADMIN: 'Admin' };
    return map[tipo] ?? tipo;
  }
}
