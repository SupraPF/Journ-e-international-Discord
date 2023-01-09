//Importez les bibliothèques nécessaires
const Discord = require('discord.js');
const fs = require('fs');
const Papa = require('papaparse');
const cron = require('node-cron');
const moment = require('moment');

//Créez un nouvel objet Discord client
const client = new Discord.Client();

//Authentifiez le client avec votre token de bot
client.login('YOUR_BOT_TOKEN_HERE');

//Chargez le fichier CSV contenant les journées internationales
const csvData = fs.readFileSync('international_days.csv', 'utf8');

//Parsez le CSV en utilisant Papa Parse
const parsedData = Papa.parse(csvData, {
  header: true,
});

//Créez une fonction qui envoie un message au channel souhaité
function sendInternationalDayMessage(channel) {
  //Récupérez la date du jour au format dd/mm
  const currentDate = moment().format('DD/MM');

  //Parcourez les journées internationales du fichier CSV pour trouver celles qui correspondent à la date du jour
  const currentDays = [];
  parsedData.data.forEach((day) => {
    if (day.date === currentDate) {
      currentDays.push(day.name);
    }
  });

  //Si aucune journée internationale n'a été trouvée, envoyez un message d'erreur
  if (currentDays.length === 0) {
    channel.send("Aujourd'hui n'est pas une journée internationale !");
    return;
  }

  //Si une seule journée internationale a été trouvée, envoyez un message la concernant
  if (currentDays.length === 1) {
    channel.send(`Aujourd'hui, c'est la journée internationale de ${currentDays[0]} !`);
    return;
  }

  //Si plusieurs journées internationales ont été trouvées, envoyez un message qui les liste toutes
  channel.send(`Aujourd'hui, c'est la journée internationale de :\n- ${currentDays.join('\n- ')}`);
}

//Utilisez cron pour exécuter la fonction tous les jours à une heure donnée
cron.schedule('0 0 * * *', () => {
  //Récupérez le channel sur lequel le bot enverra les messages
  const channel = client.channels.cache.get('YOUR_CHANNEL_ID_HERE');
  
  //Envoyez le message
  sendInternationalDayMessage(channel);
});
