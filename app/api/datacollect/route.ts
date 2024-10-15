"use client"
import { NextResponse } from 'next/server';
import { Client } from 'pg';

// PostgreSQL connection config
const client = new Client({
    connectionString: process.env.DATABASE_URL, // Ensure this env variable is set
    ssl: {
        rejectUnauthorized: false, // Required for Heroku PostgreSQL
    },
});

export async function POST(request: { json: () => PromiseLike<{ distance: any; }> | { distance: any; }; }) {
    let connected = false;

    try {
        // Parse the JSON request body to get the distance
        const { distance } = await request.json();

        // Validate that distance exists
        if (!distance) {
            return NextResponse.json(
                { status: 'error', message: 'Distance is required' },
                { status: 400 }
            );
        }

        // Connect to the PostgreSQL database
        await client.connect();
        connected = true;

        // Insert the distance into the database
        const query = 'INSERT INTO distances (distance) VALUES ($1)';
        await client.query(query, [distance]);

        // Respond with success
        return NextResponse.json(
            { status: 'success', message: 'Distance saved to the database' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error saving distance:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to save distance' },
            { status: 500 }
        );
    } finally {
        if (connected) {
            await client.end();
        }
    }
}
