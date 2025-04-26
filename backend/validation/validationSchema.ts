import z from "zod";

export const roomIDValidationSchema = z.string({message:"Room ID must be string"}).uuid({message:"Invalid Room ID"})

export const playerValidationSchema = z.object({
    name:z.string({message:"Nickname must be text"}).min(3,{message:"Nickname must be at least 3 characters long"}).max(20,{message:"Nickname must be at most 20 characters long"}),
    team:z.enum(["A","B","C"]),
    id:z.preprocess((id) => { const parsed = Number(id);
        return Number.isNaN(parsed) ? undefined : parsed;} , z.number().int().min(10000).max(99999))
})

export const roomValidationSchema = z.object({
    duration:z.number({message:"Duration must be a number"}).refine((duration)=>(duration === 120000 || duration === 300000),{message:"Invalid duration"}),
    totalTeams:z.number({message:"Total teams must be a number"}).refine((totalTeams)=>(totalTeams === 2 || totalTeams === 3),{message:"Invalid total teams"})
})

export const cardValidationSchema = z.object({
    rank:z.number({message:"Rank must be a number"}).int({message:"Rank must be an integer"}).min(1,{message:"Rank must be atleast 1"}).max(13,{message:"Rank must be at most 13"}),
    suit:z.enum(["Heart","Spade","Club","Diamond"],{message:"Invalid suit"}),
    deck:z.number({message:"Deck must be a number"}).refine((value)=>(value === 0 || value === 1),{message:"Invalid deck number"})

})