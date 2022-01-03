const axios = require('axios');
const moment = require('moment');
const dotenv = require("dotenv");
dotenv.config({ path: require('find-config')('.env') });

let backendUrl = process.env.VUE_APP_BACKEND_URL || "http://localhost:3000/api/v1"

module.exports = (ctx) => {

    axios.get(backendUrl + "/peticionesPublicacion")
        .then(response => {
            let events = ""
            const lenEvents = events.length
            for(const element in response.data) {
                const date1 = new Date(response.data[element].inicio)
                if (Date.now() <= date1){
                    events = response.data[element].titulo + ", " + moment(response.data[element].inicio).locale("es").format('LLL') + " - "+ 
                    moment(response.data[element].fin).locale("es").format('LLL') + ", " + response.data[element].descripcion + "\n"

                    var options = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{
                                    text: "Ver más",
                                    url: "https://www.eventbrite.es/e/"+response.data[element].idEvento
                                }],
                            ],
                        }),
                      };

                    ctx.reply(events, options)
                }
            }

            if (lenEvents == events.length){
                events = "¡Vaya! Parece que todavía no se han añadido nuevos eventos."
                ctx.reply(events)
            }
            
        }).catch(error => {
            console.log(error);
        });
    
}
