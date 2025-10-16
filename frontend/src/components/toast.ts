export type ToastType = 'success' | 'error' | 'info';

export class Toast {
  static show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    const existingToast = document.getElementById('toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getIcon(type)}</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  private static getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }

  static success(message: string): void {
    this.show(message, 'success');
  }

  static error(message: string): void {
    this.show(message, 'error', 4000);
  }

  static info(message: string): void {
    this.show(message, 'info');
  }
}