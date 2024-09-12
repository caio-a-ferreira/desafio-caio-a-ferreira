class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
      { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
      { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
      { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
      { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] },
    ];

    this.animais = {
      'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
      'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
      'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
      'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
      'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
      'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
    };
  }

  analisaRecintos(especie, quantidade) {
    if (!this.animais[especie]) {
      return { erro: "Animal inválido" };
    }
    if (quantidade <= 0 || isNaN(quantidade)) {
      return { erro: "Quantidade inválida" };
    }

    const animalInfo = this.animais[especie];
    let recintosViaveis = [];

    // Verificar cada recinto
    this.recintos.forEach(recinto => {
      let espacoOcupado = recinto.animais.reduce((total, animal) => total + (animal.tamanho * animal.quantidade), 0);
      let espacoLivre = recinto.tamanho - espacoOcupado;

      const biomaCompativel = animalInfo.bioma.some(bioma => recinto.bioma.includes(bioma));
      if (!biomaCompativel) return;

      // Verificar compatibilidade de espécies
      let compatível = true;
      for (const animal of recinto.animais) {
        const infoAnimal = this.animais[animal.especie];
        if (infoAnimal.carnivoro && !animalInfo.carnivoro) {
          compatível = false;
          break;
        }
        if (animalInfo.carnivoro && infoAnimal.carnivoro) {
          compatível = false;
          break;
        }
      }
      if (!compatível) return;

      if (animalInfo.carnivoro && recinto.animais.length > 0) {
        if (recinto.animais.some(a => a.especie !== especie)) {
          return;
        }
      }

      if (especie === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') {
        return;
      }

      if (especie === 'MACACO') {
        if (recinto.animais.length === 0 && quantidade < 2) return;
        if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === especie)) {
          espacoLivre -= 1; 
        }
      }

      const espacoNecessario = animalInfo.tamanho * quantidade;

      if (espacoLivre >= espacoNecessario) {
        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
      }
    });

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis };
  }
}

export { RecintosZoo };
