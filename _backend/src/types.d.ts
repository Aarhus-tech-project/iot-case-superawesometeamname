type Id = number | string;

declare module "@iot-case/types" {
	interface IRegister {
		username: string;
		password: string;
		age: number;
		height: number;
		weight: number;
	}

	interface ILogin {
		username: string;
		password: string;
	}

	interface IData {
		userId: Id;
		heartrate: number;
		steps: number;
		distance: number;
		gforce: number;
	}

	interface IDataReturn {
		id: Id;
		heartRate: number;
		steps: number;
		distance: number;
		gForce: number;
	}
}