"use strict";
// seed-services.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_model_1 = __importDefault(require("../models/service.model"));
async function seed() {
    await service_model_1.default.create([
        {
            name: 'Buddy Sessions',
            description: 'For when you just need someone to listen without judgment.',
            details: 'Our trained Buddies are empathetic listeners here to support you in a friendly, casual conversation. No advice, no fixing — just presence and compassion.',
            greatFor: 'Venting, emotional release, light talk',
            duration: 45,
            price: 0,
            mode: 'phone call',
            tags: ['affordable', 'chat', 'call'],
        },
        {
            name: 'Mentor Sessions',
            description: 'For guidance, clarity, and structured life support.',
            details: 'Our Mentors help you navigate specific challenges — like stress, purpose, relationships, or goals — with personal development tools and practical insights.',
            greatFor: 'Career confusion, life purpose, motivation',
            duration: 45,
            price: 0,
            mode: 'google meet',
            tags: ['mid-range', 'call', 'video'],
        },
        {
            name: 'Psychologist Sessions',
            description: 'For in-depth mental health support by professionals.',
            details: 'Licensed psychologists and trained mental health experts to support deeper issues like anxiety, depression, trauma, grief, or emotional regulation.',
            greatFor: 'Diagnosed or undiagnosed emotional/mental concerns',
            duration: 45,
            price: 0,
            mode: 'google meet',
            tags: ['premium', 'video'],
        },
    ]);
    console.log('Seed complete');
}
seed();
//# sourceMappingURL=service.seeder.js.map