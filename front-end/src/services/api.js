import axios from "axios";

// --- ADICIONADO: Importações necessárias para o Redux ---
// O caminho '../store' pode precisar de ajuste dependendo da sua estrutura de pastas
import { store } from '../store'; 
import { LOGOUT, SET_MENU_ITEMS } from '../store/actions';

// Cria a instância base do Axios
export const api = axios.create({});

// --- INTERCEPTOR DE REQUISIÇÃO (O seu código, já está perfeito) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- ADICIONADO: INTERCEPTOR DE RESPOSTA ---
// Este código irá rodar DEPOIS que cada resposta da API for recebida.
api.interceptors.response.use(
  (response) => {
    // Se a resposta for um sucesso (status 2xx), apenas a retorne sem fazer nada.
    return response;
  },
  (error) => {
    // Se a resposta for um erro...
    // Verifica se o erro é 401 (Não Autorizado / Token Expirado)
    if (error.response && error.response.status === 401) {
        
        // 1. Limpa o token do localStorage
        localStorage.removeItem('token');
        
        // 2. Remove o header de autorização para futuras requisições
        delete api.defaults.headers.common.Authorization;
        
        // 3. Despacha as ações de logout para limpar o estado do Redux
        store.dispatch({ type: LOGOUT });
        store.dispatch({ type: SET_MENU_ITEMS, items: [] });
        
        // 4. Redireciona o usuário para a página de login
        // window.location.href para forçar um recarregamento completo da aplicação
        // e garantir que todos os estados sejam limpos.
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    
    // Retorna o erro para que outras partes do código possam tratá-lo se necessário
    return Promise.reject(error);
  }
);