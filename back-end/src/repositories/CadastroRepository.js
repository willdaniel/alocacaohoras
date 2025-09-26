import BaseRepository from "./BaseRepository.js";

class CadastroRepository extends BaseRepository {
    constructor(tabela, columns) {
        super();
        this.tabela = tabela;
        this.columns = columns;
    }

    async getAll(transactionClient) {
        try {
            return await super.getAll(this.tabela, ['*'], transactionClient);
        } catch (error) {
            throw error;
        }
    }

    async getByID(id, transactionClient) {
        try {
            return await super.getByID(this.tabela, this.columns, id, transactionClient);
        } catch (error) {
            throw error;
        }
    }

    async insertOne(valuesArray, transactionClient) {
        try {
            const columnsToInsert = this.columns.filter(col => col !== 'id');
            return await super.insertOne(this.tabela, columnsToInsert, valuesArray, transactionClient);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateByID(id, fieldsToUpdate, transactionClient) {
        try {
            const columnsToUpdate = Object.keys(fieldsToUpdate);
            const valuesArray = Object.values(fieldsToUpdate);

            if (columnsToUpdate.length === 0) {
                return { rowCount: 0, message: "Nenhum campo para atualizar." };
            }
            
            return await super.updateByID(this.tabela, columnsToUpdate, valuesArray, id, transactionClient);

        } catch (error) {
            throw error;
        }
    }

    async deleteByID(id, transactionClient) {
        try {
            return await super.deleteByID(this.tabela, id, transactionClient);
        } catch (error) {
            throw error;
        }
    }
}

export default CadastroRepository;
