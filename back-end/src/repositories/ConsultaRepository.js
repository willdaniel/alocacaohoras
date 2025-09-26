import BaseRepository from "./BaseRepository.js";

class ConsultaRepository extends BaseRepository {
    constructor(tabela, columns) {
        super();
        this.tabela = tabela;
        this.columns = columns; // Agora você pode passar ['colaborador_id', 'disciplina_id', ...]
    }

    async getAll() {
        try {
            return await super.getAll(this.tabela, this.columns);
        } catch (error) {
            throw error;
        }
    }
}

export default ConsultaRepository;
