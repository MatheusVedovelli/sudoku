class Cell
{
    constructor(linha, coluna) // inicializa a classe
    {
        this.x = coluna*rectSize; // seta a posição X da celula com base na coluna
        this.y = linha*rectSize; // seta a posição Y da celula com base na linha
        this.linha = linha; // salva a linha
        this.coluna = coluna; // salva a coluna
        this.value = 0; // limpa o valor
        this.valid = -1; // seta como indefinido (0 = inválido, 1 = válido, -1 = indefinido)
        this.fixed = 0; // seta como não fixo
        this.selected = false; // seta como não selecionado
    }

    select() // seta o estado da celula para selecionado
    {
        if(this.fixed != 0) // caso seja uma celula fixa, não selecionar
            return false;

        this.selected = true;

        return true;
    }

    unselect() // remove o selecionado
    {
        this.selected = false;
    }

    findRegion(value) // verifica se alguma celula da região tem o mesmo valor
    {
        let startX = (Math.floor(this.coluna/gridSize) * gridSize); // calcula o X da região com base na coluna atual
        let startY = (Math.floor(this.linha/gridSize) * gridSize); // calcula o Y da região com base na linha atual

        for(let i = startY; i < startY + gridSize; i++)
        {
            for(let j = startX; j < startX + gridSize; j++)
            {
                if(grid[i][j].value == value && grid[i][j] != this) // caso uma celula tenha o mesmo valor e não seja a celula atual...
                    return true;
            }
        }

        return false;
    }

    checkValid() // verifica se a celula tem um valor válido (unico na linha, coluna e região)
    {        
        if(this.value < 1 || this.value > 9) // verifica se o valor está dentro dos limites
            return false;

        if(this.findRegion(this.value)) // verifica se alguma celula na região tem o mesmo valor
        {
            this.valid = 0;
            return false;
        }
        else
        {
            for(let i = 0; i < gridSize*gridSize; i++)
            {
                if(grid[this.linha][i] == this || grid[i][this.coluna] == this) // ignora a celula atual na linha e na coluna
                    continue;
                if(grid[this.linha][i].value == this.value) // caso uma celula na mesma linha tenha o mesmo valor...
                {
                    this.valid = 0;
                    return false;
                }
                if(grid[i][this.coluna].value == this.value) // caso uma celula na mesma coluna tenha o mesmo valor...
                {
                    this.valid = 0;
                    return false;
                }
            }
        }

        this.valid = 1;

        return true;
    }

    setValue(value, starting) // seta o valor da celula
    {
        if(value < 0 || value > 9)
            return false;

        if(starting) // se o jogo estiver iniciando, o preenchimento automático seta a celula como fixa
            this.fixed = 1;

        this.value = value;     
        return true;
    }

    draw() // desenha a celula
    {
        noFill(); // remove o preenchimento do retangulo
        stroke(128); // seta a cor do contorno
        strokeWeight(1); // seta a grossura do contorno

        if(this.selected) // caso esteja selecionado
        {
            stroke(243, 156, 18); // altera a cor do contorno pra sinalizar que está selecionado
            strokeWeight(3); // aumenta a grossura do contorno
        }
        else if(!this.fixed && this.value > 0) // caso não esteja selecionado mas seja um valor válido colocado pelo usuário
        {
            /*if(this.valid == 1) // caso seja uma celula válida, seta a cor do contorno pra verde
                stroke(0, 255, 0);
            else if(this.valid == 0) // caso seja uma celula inválida, seta a cor do contorno pra vermelho
                stroke(255, 0, 0);*/
            
            stroke(255, 0, 255); // seta a cor do contorno pra rosa para sinalizar que foi alterada (desativar caso use o if/else acima)
        }

        rect(this.x, this.y, rectSize, rectSize); // desenha a celula
        

        if(this.value > 0) // caso o valor da celula seja maior que 0, desenha no centro da celula
        {
            fill(10); // seta o preenchimento pra preto RGB(10, 10, 10)
            textSize(32); // seta o tamanho da letra
            textAlign(CENTER, CENTER); // centraliza a letra
            text(this.value, this.x + (rectSize/2), this.y + (rectSize/2)); // desenha o texto
        }
        strokeWeight(1); // restaura a grossura da linha
    }
}