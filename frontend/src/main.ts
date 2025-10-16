import { Header } from './components/header';
import { FavoritosPage } from './pages/favoritos.page';
import { HomePage } from './pages/home.page';
import { LoginPage } from './pages/login.page';
import { router } from './router/router';

class App {
  private header: Header;

  constructor() {
    this.header = new Header('header');
    this.setupRoutes();
    this.init();
  }

  private setupRoutes(): void {
    router.register('/login', () => {
      const loginPage = new LoginPage();
      loginPage.render();
    });

    router.register('/', async () => {
      const homePage = new HomePage();
      await homePage.render();
    }, true);

    router.register('/favoritos', async () => {
      const favoritosPage = new FavoritosPage();
      await favoritosPage.render();
    }, true);

    router.register('/404', () => {
      const main = document.getElementById('main')!;
      main.innerHTML = `
        <div class="error-state">
          <h1>404</h1>
          <h2>Página não encontrada</h2>
          <p>A página que você está procurando não existe.</p>
          <button class="btn btn-primary" onclick="window.location.href='/'">
            Voltar para início
          </button>
        </div>
      `;
    });
  }

  private init(): void {
    router.init();
    console.log('🎬 BlueFlow iniciado');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});