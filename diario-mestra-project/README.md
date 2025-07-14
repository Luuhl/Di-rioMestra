Passos para colaborar no projeto no GitHub:

1º passo: Aceitar o convite do GitHub.

2º passo: Abrir o VSCode e depois abrir um novo terminal.
(Apague terminais abertos para não confundir. Fica no menu ao lado direito do terminal aberto. Não é obrigatório, mas é bom fechar quando abrir um novo.)

3º passo: (Só na primeira vez que forem acessar o código)
No terminal, digitar:
git clone https://github.com/melsousa-o/Pice-PIW.git
(Este comando clona todo o código do repositório online para seu VSCode local)
Depois disso, entrar na pasta do projeto com:
cd Pice-PIW
(ou abrir a pasta manualmente com "Open Folder")

4º passo: (Sempre antes de começar a fazer qualquer coisa no código)
Dentro da pasta do projeto, digitar no terminal:
git pull
(Este comando baixa qualquer mudança que alguém do grupo tenha feito, mantendo seu código atualizado)
Depois que baixar as alterações, você pode começar a codar.

5º passo: (Depois de codar qualquer coisa)
No terminal, digitar:
git add .
(Este comando adiciona todas as modificações feitas em todas as pastas do diretório)
Depois, faça o commit com uma mensagem explicando as mudanças, por exemplo:
git commit -m "Acabei de mudar a cor do botão da página X e fiz a tela Y"
Sempre usar aspas após o -m.
Por fim, envie as alterações para o repositório com:
git push
(O comando push é essencial para enviar seu código para o GitHub. Só o add não atualiza o repositório!)
Assim, quando outra pessoa for codar, poderá usar git pull para atualizar o código local.