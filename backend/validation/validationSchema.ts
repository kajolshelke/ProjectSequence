import z from "zod";

export const roomIDValidationSchema = z.string({message:"Room ID must be string"}).uuid({message:"Invalid Room ID"})

export const playerValidationSchema = z.object({
    name:z.string({message:"Nickname must be text"}).min(3,{message:"Nickname must be at least 3 characters long"}).max(20,{message:"Nickname must be at most 20 characters long"}),
    team:z.enum(["A","B","C"])
})

export const roomValidationSchema = z.object({
    duration:z.number({message:"Duration must be a number"}).refine((duration)=>(duration === 120000 || duration === 300000),{message:"Invalid duration"}),
    totalTeams:z.number({message:"Total teams must be a number"}).refine((totalTeams)=>(totalTeams === 2 || totalTeams === 3),{message:"Invalid total teams"})
})