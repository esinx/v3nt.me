import fs from "fs";
import { v4 } from "uuid";

let vents = process.env.VENT_PATH ? JSON.parse(fs.readFileSync(process.env.VENT_PATH)) : [];

export const post = async (req, res) => {
	const { vent } = req.body;
	if (!vent) return res.sendStatus(400);
	const date = new Date();
	const id = v4();
	const append = { id, vent, date };
	vents = [append, ...vents.slice(0, 4)];
	if (process.env.VENT_PATH)
		fs.writeFileSync(process.env.VENT_PATH, JSON.stringify(vents, null, 4));
	return res.send({ id });
};

export const get = async (req, res) => {
	return res.send(vents);
};
