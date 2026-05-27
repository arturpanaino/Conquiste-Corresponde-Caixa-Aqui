const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ler os dados do formulário e permitir acesso externo
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir os arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Transportador de E-mail (Usando o Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail (configurado no Render)
        pass: process.env.EMAIL_PASS  // Sua Senha de App do Gmail (configurada no Render)
    }
});

// Rota que recebe os dados do formulário
app.post('/api/simulacao', (req, res) => {
    const dados = req.body;

    // Montando o corpo do e-mail em formato HTML bem organizado
    const emailConteudo = `
        <h2>Nova Simulação Recebida! 🎉</h2>
        <p>Um cliente acabou de preencher o formulário no site Conquiste Caixa Aqui. Veja os dados abaixo:</p>
        
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif;">
            <tr style="background-color: #f2f2f2;">
                <th align="left">Campo</th>
                <th align="left">Resposta do Cliente</th>
            </tr>
            <tr><td><b>Modalidade</b></td><td>${dados.modalidade}</td></tr>
            <tr><td><b>Valor do Imóvel</b></td><td>${dados.valorImovel}</td></tr>
            <tr><td><b>Já possui imóvel na cidade?</b></td><td>${dados.possuiImovel}</td></tr>
            <tr><td><b>Data de Nascimento</b></td><td>${dados.dataNascimento}</td></tr>
            <tr><td><b>Mais de 1 comprador/dependente?</b></td><td>${dados.maisCompradores}</td></tr>
            <tr><td><b>FGTS +3 anos?</b></td><td>${dados.fgts}</td></tr>
            <tr><td><b>Funcionário público?</b></td><td>${dados.funcPublico}</td></tr>
            <tr><td><b>Renda Familiar Bruta</b></td><td>${dados.rendaFamiliar}</td></tr>
            <tr><td><b>Comprovação de Renda</b></td><td>${dados.tipoRenda} ${dados.tipoEmpresa ? ' — ' + dados.tipoEmpresa : ''}</td></tr>
        </table>
        
        <br>
        <p><i>Este é um relatório automático gerado pelo seu site.</i></p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'arturpanaino@gmail.com', // O e-mail onde você deseja receber o relatório
        subject: `🚨 Nova Simulação - ${dados.modalidade}`,
        html: emailConteudo
    };

    // Envia o e-mail de fato
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).json({ success: false, message: 'Erro ao processar envio.' });
        }
        console.log('E-mail enviado: ' + info.response);
        res.status(200).json({ success: true, message: 'Simulação enviada com sucesso!' });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});