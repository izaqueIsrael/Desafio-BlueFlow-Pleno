import { authStore } from '../store/auth.store';

type RouteHandler = () => void | Promise<void>;

interface Route {
  path: string;
  handler: RouteHandler;
  requireAuth?: boolean;
}

class Router {
  private routes: Route[] = [];
  private currentPath: string = '';

  register(path: string, handler: RouteHandler, requireAuth: boolean = false): void {
    this.routes.push({ path, handler, requireAuth });
  }

  navigate(path: string): void {
    if (this.currentPath === path) return;
    
    history.pushState(null, '', path);
    this.render();
  }

  private findRoute(path: string): Route | undefined {
    return this.routes.find(route => route.path === path);
  }

  private async render(): Promise<void> {
    const path = window.location.pathname;
    this.currentPath = path;

    let route = this.findRoute(path);

    if (!route) {
      route = this.findRoute('/404');
    }

    if (route) {
      if (route.requireAuth && !authStore.isAuth()) {
        this.navigate('/login');
        return;
      }

      if (path === '/login' && authStore.isAuth()) {
        this.navigate('/');
        return;
      }

      await route.handler();
    }
  }

  init(): void {
    window.addEventListener('popstate', () => this.render());
    
    authStore.subscribe((state) => {
      if (!state.isAuthenticated && this.currentPath !== '/login') {
        this.navigate('/login');
      }
    });

    this.render();
  }

  getCurrentPath(): string {
    return this.currentPath;
  }
}

export const router = new Router();