import axios from "../api/axios";
const VEHICLE_API="vehicles"
export const fetchvehicles=async()=>{
    return await axios.get(VEHICLE_API); // Envoi d'une requête GET pour obtenir la liste des articles
}
// Fonction asynchrone pour récupérer un article par son ID
export const fetchvehicleById=async(vehicleId)=> {
    return await axios.get(VEHICLE_API + '/' + vehicleId);// Envoi d'une requête GET pour obtenir un article spécifique
}
// Fonction asynchrone pour supprimer un article par son ID  
export const deletevehicle=async(vehicleId) =>{
    return await axios.delete(VEHICLE_API + '/' + vehicleId);// Envoi d'une requête DELETE pour supprimer un article
    }
    export const addvehicle = async (vehicle) => {
        return await axios.post(VEHICLE_API, vehicle, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      };
    // Fonction pour modifier un article existant
    // vehicleservice.js
export const editvehicle = (vehicleId, vehicleData) => {
    return axios.put(`${VEHICLE_API}/${vehicleId}`, vehicleData);
};


export const fetchVehicleOptions = async () => {
    return await axios.get(VEHICLE_API + '/options'); 
    // Même style que vos autres méthodes
};