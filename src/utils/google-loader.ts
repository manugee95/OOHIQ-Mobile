import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";

export const googleMapClient = new Client({
	axiosInstance: axios.create(),
});
