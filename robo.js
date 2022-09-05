const puppeteer = require('puppeteer');
const express = require('express');
var app = express();

const port = 3000;

app.use(express.json());
app.get('/',function(req,res){
  let connectionCode=req.query.connectionCode;
  let m3u=req.query.m3u;
  let nome=req.query.nome;
  //res.send(`<p>Connection : ${connectionCode} <p>url : ${m3u} <p>nome : ${nome} cadastrado.`);
  robot(connectionCode,m3u,nome);
  res.sendFile(__dirname + '/retorno.html')
});  
app.listen(3001);

function logWeb(msg){
  
//  app.get('/', (req, res) => {
//    res.send(`${msg}`);
    console.log(`${msg}`);
//  })
  
}

async function robot(connectionCodeIni,m3u,nome){

try
  {
    logWeb('Inicio');
    logWeb("-------------");
    logWeb("Robo - Inicio");
    logWeb("-------------");
    logWeb(`Recebendo parametro connectionCode : ${connectionCodeIni}`);
    logWeb(`Recebendo parametro url : ${m3u}`);
    logWeb(`Recebendo parametro nome : ${nome}`);
    
    logWeb("-------------");
    
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const paginaPrincipal=`https://ss-iptv.com/en/users/playlist`;
    const paginaSecundaria=`https://ss-iptv.com/en/users/playlist#playlists`;
  
    logWeb(`-------------------------------------`);
    logWeb(`Abrindo pagina - ${paginaPrincipal}`);
    logWeb(`-------------------------------------`);

    await page.goto(paginaPrincipal);
    logWeb(`Iniciando envio de parametros`);
  
    logWeb(`-------------------------------------------------------`);
    logWeb(`Inserção do campo Connection code : ${connectionCodeIni}`);
    logWeb(`-------------------------------------------------------`);

    await page.evaluate((connectionCodeIni) => {
      document.documentElement.querySelector('input#inptConnectionCodeInput').value =connectionCodeIni;
    }, connectionCodeIni);

    logWeb(`Retornado `);
  
    logWeb("  Add Device ");
    await page.click('button#btnAddDevice');
    const resultadoAddDevice ="";
    const positionSuccess=-1;
    var positionIni=-1;
    var positionFim=-1;
    var msgSaida='';
    const visivel='';
    logWeb("Aguardando mensagem de erro");
      try
      { 
        visivel = await page.evaluate(() => {     
        return document.documentElement.querySelector('div.system-message-container').innerHTML;
  });
      }
      catch
      { 
      }
      finally
      {
      }
      logWeb(`Visivel ${visivel}`);

      try
      {
      resultadoAddDevice = await page.evaluate(() => {
        return document.documentElement.querySelector(`div.alert.alert-error`).innerHTML;
      });
     

      logWeb(`[Validar Erro] - ${resultadoAddDevice}`);
      positionIni=resultadoAddDevice.search(`alert alert-error`);
      positionFim=resultadoAddDevice.search(`close`)-15;
      msgSaida=resultadoAddDevice.substring(positionIni,positionFim);
      }
      catch(err1)
      {
      } 
      finally
      {
      }
  

    try
    {
      logWeb('Entrando no link');
      await page.waitForSelector('a#playlistsTab');
      logWeb('Entrou no link');
      
      await page.evaluate(()=>document.querySelector('a#playlistsTab').click())
     //await page.waitForFunction("document.documentElement.querySelector('a#playlistsTab').click();");  
     logWeb('Clicou no link');
     await page.evaluate(()=>document.querySelector('div#btnAddPlaylistItem').click())
//      Displayed Name input#inputStreamTitle
//     Enter URL    - input#inputStreamURL
//      OK button#btnApplyChanges
    await page.evaluate((nome) => {
  document.documentElement.querySelector('input#inputStreamTitle').value =nome;
}, nome);
await page.evaluate((m3u) => {
document.documentElement.querySelector('input#inputStreamURL').value =m3u;
}, m3u);

await page.evaluate(()=>document.querySelector('button#btnApplyChanges').click())

    }
    catch(err3)
    { 
      console.log(err3);
    }
    finally
    {
    }

  }
  catch(err)
  {

  }
  finally
  {

  }
  
};
