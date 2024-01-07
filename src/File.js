import fs from 'fs'

class File {

    constructor(path) {
        this.path = path
    }

    getFile = async () => {
        let data = await fs.promises.readFile(this.path, 'utf-8');
        const respuesta = await JSON.parse(data)
        return respuesta;
    }

    exist = () => {
        return fs.existsSync(this.path);
    }

    setFile = async (array) => {
        await fs.promises.writeFile(this.path, JSON.stringify(array))
    }

    findFile = async (element) => {

        let respuesta = await this.getFile();

        return respuesta.find(e => e.id == element) != undefined;

    }

}

export default File;