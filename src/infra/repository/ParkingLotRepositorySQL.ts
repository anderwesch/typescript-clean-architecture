import ParkingLotAdapter from "../../adapter/ParkingLotAdapter";
import ParkingLot from "../../core/entity/ParkingLot";
import ParkingLotRepository from "../../core/repository/ParkingLotRepository";
import database from "../database/database";

export default class ParkingLotRepositorySQL implements ParkingLotRepository {

    async getParkingLot(code: string): Promise<ParkingLot> {
        const parkingLotData = await database.oneOrNone("SELECT *, (SELECT count(*) FROM parked_car pc WHERE pc.code = pl.code)::int as occupied_spaces FROM public.parking_lot pl WHERE pl.code = $1", [code]);

        return ParkingLotAdapter.create(parkingLotData.code, parkingLotData.capacity, parkingLotData.open_hour, parkingLotData.close_hour, parkingLotData.occupied_spaces);
    }
    async saveParkedCar(code: string, plate: string, date: Date): Promise<void>{
        await database.none("insert into public.parked_car values ($1, $2, $3)", [code, plate, date]);
    }

}