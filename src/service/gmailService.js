const {google} = require('googleapis');


require("dotenv").config();


const client_id = process.env.VUE_APP_CLIENTID;
const client_secret = process.env.VUE_APP_CLIENTSECRET;
const uri = process.env.VUE_APP_FRONTEND_URL;

const SCOPES=[
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    'https://mail.google.com/'
];

const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, uri);



export function obtenerAuthURL(){
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
}

export async function obtenerToken(code) {  
    let tok= await oAuth2Client.getToken(code);
    return tok 
}

function makeBody(to, from, subject, message) {
  var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
  ].join('');

  var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      return encodedMail;
}

function sendMessage(str,evento) {
    console.log(str)
    console.log("true o false", str==='innosoft.eventia@gmail.com' , 'innosoft.eventia@gmail.com', str)
    var message='El evento '+evento.titulo+ ' va a empezar el día y hora '+ evento.inicio+' y a va acabar el día '+ evento.fin;
    var raw = makeBody(str, 'innosoft.eventia@gmail.com', evento.titulo, message);
    const gmail = google.gmail({version: 'v1', oAuth2Client});
     gmail.users.messages.send({
        auth: oAuth2Client,
        userId: 'me',
        resource: {
            raw: raw
         }
    }, function(err, response) {
         return(err || response)
     });
}
export function enviarEmail(tokenMail,mails,evento) {
    console.log("los emails que llegan son",mails)
    oAuth2Client.setCredentials(JSON.parse(tokenMail));
    sendMessage(mails,evento)
  }