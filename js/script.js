/*
Criado por: Matheus Vedovelli
Data: 22/10/2019
Créditos: https://github.com/robatron/sudoku.js/ API para gerar o sudoku
*/

let rectSize = 60; // tamanho da celula
let gridSize = 3; // tamanho do grid do sudoku
let grid = []; // array que vai conter as celulas
let selectedCell; // celula selecionada
let p; // <p> pra mostrar se venceu ou não
let buttonFinish; // botão pra finalizar
let buttonReset; // botão pra resetar

function createGrid() // cria o grid do sudoku
{
    for(let i = 0; i < gridSize*gridSize; i++) // cria linhas e colunas e preenche com uma celula padrão
    {
        grid[i] = [];
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            grid[i][j] = new Cell(i, j);
        }
    }
}

function checkCells() // verifica as celulas
{
    for(let i = 0; i < gridSize*gridSize; i++)
    {
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            if(!grid[i][j].fixed) // caso não seja uma celula fixa
            {
                grid[i][j].checkValid(); // verifica se é valida
            }
        }
    }
}

/* TIPOS DE DIFICULDADE
"easy":         62
"medium":       53
"hard":         44
"very-hard":    35
"insane":       26
"inhuman":      17
*/

function fillGrid() // gera o sudoku e preenche o grid com os valores fixos
{
    let string = sudoku.generate("easy"); // API usada para gerar o sudoku pois eu nao faço ideia de como gerar este diacho

    string = sudoku.board_string_to_grid(string); // transformando o texto da API em um grid

    for(let i = 0; i < gridSize*gridSize; i++)
    {
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            if(string[i][j] != ".") // "." significa campo em branco, portanto se for isso seta com 0, caso contrário seta o valor no campo fixo
                grid[i][j].setValue(Number(string[i][j]), 1);
            else
                grid[i][j].setValue(0, 0);
        }
    }

    selectedCell = 0; // limpa a celula selecionada

    checkCells();
}

function isMousePos(x, y, w, h) // verifica se o mouse está dentro do rect
{
    if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h)
        return true;
    
    return false;
}

function setup()
{
    createCanvas(rectSize*gridSize*gridSize + 1, rectSize*gridSize*gridSize); // cria o canvas pra printar as parada

    p = createP(""); // cria o P (ora ora)
    buttonFinish = createButton("FINISH"); // cria o botão (ora ora)²
    buttonFinish.mousePressed(finish); // seta o onclick do botão pra finish
    buttonReset = createButton("RESET"); // cria o outro botão (ora ora)³
    buttonReset.mousePressed(reset); // seta o onclick do botão pra reset

    frameRate(15) // seta o framerate pra 15 só pra atualzar as corzinha dos quadrado pra ficar bonitin

    createGrid(); // cria o grid
    fillGrid(); // preenche o grid
}

function mousePressed() // quando ocorre um click do mouse
{
    let found = false;

    if(selectedCell) // caso já tenha uma celula selecionada
    {
        if(isMousePos(selectedCell.x, selectedCell.y, rectSize, rectSize)) // se o click for dentro da mesma, ignore
        {
            return false;
        }
        else // senão, remova a seleção da celula
        {
            selectedCell.unselect();
            selectedCell = 0;
        }
    }

    for(let i = 0; i < gridSize*gridSize; i++)
    {
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            if(isMousePos(grid[i][j].x, grid[i][j].y, rectSize, rectSize)) // se o mouse estiver dentro de alguma celula
            {
                found = true; // rá, achou

                if(grid[i][j].select()) // selecionar a celula
                    selectedCell = grid[i][j];

                break; // lendo comentário até do break luis pelo amor de deus (se nao for o luis pode ler tudo)
            }

            if(found)
                break; // PORRA LUIS DNV KRA
        }
    }
}

function keyTyped() // caso escreva algo
{
    if(selectedCell) // se tiver uma celula selecionada
    {
        if(Number.isInteger(Number(key))) // verifica se é um numero pra nenhum filhadaputa meter um Z na celula
        {
            selectedCell.setValue(Number(key), 0); // seta o valor
            selectedCell.unselect(); // remove a seleção
            selectedCell = 0; // limpa a celula selecionada
            checkCells(); // verifica se as celulas são validas pra setar a corzinha e tal
        }
    }
}

function draw()
{
    background(255); // seta o fundo pra branco
    noFill(); // tira o preenchimento do rect
    rect(1, 0, width - 1, height); // cria a "moldura" do jogo

    for(let i = 0; i < gridSize*gridSize; i++)
    {
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            grid[i][j].draw(); // desenha todas as celulas
        }
    }

    for(let i = 1; i < 3; i++) // desenha as linhas que separam os quadrantes
    {
        stroke(0); // seta a cor pra preto RGB(0,0,0);
        strokeWeight(3); // grossura da linha
        line(0, i*(rectSize*3), rectSize*(gridSize*gridSize), i*(rectSize*3));
        line(i*(rectSize*3), 0, i*(rectSize*3), rectSize*(gridSize*gridSize));
        strokeWeight(1); // restaura a grossura da linha
    }
}

function finish() // quando clica no botao finalizar
{
    let complete = true; // inicializa com true pq a verificação vai mudar caso tenha alguma celula inválida

    for(let i = 0; i < gridSize*gridSize; i++)
    {
        for(let j = 0; j < gridSize*gridSize; j++)
        {
            if(grid[i][j].valid != 1) // se a celula nao for valida
            {
                complete = false; // nao ta completo
                break; // luis...
            }
        }

        if(complete == false)
            break; // ta parei
    }

    if(complete) // se estiver completo
    {
        p.html("<h1> Você venceu! </h1>"); // yupi parabens
        noLoop(); // trava o loop da draw() (congela o jogo)
    }
    else // senao
    {
        p.html("<h1> Algo está errado... </h1>"); // vose eburo
    }
}

function reset() // quando clica no reset
{
    fillGrid(); // preenche com um novo sudoku o grid
    p.html(""); // limpa o p pra ficar bonitinho
    loop(); // reinicia o loop da draw()
}