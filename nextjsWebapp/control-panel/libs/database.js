//First run the command npm install mongoose to install mongoose
import mongoose from 'mongoose'; // Import mongoose

// Connect to MongoDB
const connect = async () => { //Creo una funzione asincrona per connettermi a MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URL, { //Mi connetto a MongoDB usando l'url di connessione nel file .env
            //useNewUrlParser: true, //Usa il nuovo parser di URL di mongoose
            //useUnifiedTopology: true //Try to find a server to send any given operation to, and keep retrying.
            /* Tuttavia ora non servono più*/
        });
        console.log('MongoDB connected!'); //Se la connessione è riuscita, stampo a console questo messaggio     
    } catch (error) {
        throw new Error('Error connecting to MongoDB'); //Se la connessione non è riuscita, stampo a console questo messaggio
    }
}

export default connect; // Export the connect function
