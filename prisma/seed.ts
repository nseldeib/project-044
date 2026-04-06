// Seed script for VECTOR — Real-Time Movement Intelligence Platform
// Run with: npm run db:seed

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const now = new Date();
const h = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);
const m = (minutes: number) => new Date(now.getTime() + minutes * 60 * 1000);

async function main() {
  // Clear all data
  await prisma.alert.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.subwayTrain.deleteMany();
  await prisma.subwayLine.deleteMany();
  await prisma.bikeStation.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.airport.deleteMany();

  // ── Airports ───────────────────────────────────────────────
  const airports = await prisma.airport.createManyAndReturn({
    data: [
      { iata: 'JFK', icao: 'KJFK', name: 'John F. Kennedy International', city: 'New York', country: 'US', lat: 40.6413, lon: -73.7781, timezone: 'America/New_York', elevation: 13 },
      { iata: 'LGA', icao: 'KLGA', name: 'LaGuardia Airport', city: 'New York', country: 'US', lat: 40.7769, lon: -73.8740, timezone: 'America/New_York', elevation: 21 },
      { iata: 'EWR', icao: 'KEWR', name: 'Newark Liberty International', city: 'Newark', country: 'US', lat: 40.6895, lon: -74.1745, timezone: 'America/New_York', elevation: 18 },
      { iata: 'LAX', icao: 'KLAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'US', lat: 33.9425, lon: -118.4081, timezone: 'America/Los_Angeles', elevation: 125 },
      { iata: 'ORD', icao: 'KORD', name: "O'Hare International", city: 'Chicago', country: 'US', lat: 41.9742, lon: -87.9073, timezone: 'America/Chicago', elevation: 672 },
      { iata: 'MIA', icao: 'KMIA', name: 'Miami International', city: 'Miami', country: 'US', lat: 25.7959, lon: -80.2870, timezone: 'America/New_York', elevation: 8 },
      { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International', city: 'San Francisco', country: 'US', lat: 37.6213, lon: -122.3790, timezone: 'America/Los_Angeles', elevation: 13 },
      { iata: 'BOS', icao: 'KBOS', name: 'Boston Logan International', city: 'Boston', country: 'US', lat: 42.3656, lon: -71.0096, timezone: 'America/New_York', elevation: 20 },
      { iata: 'DCA', icao: 'KDCA', name: 'Ronald Reagan Washington National', city: 'Arlington', country: 'US', lat: 38.8521, lon: -77.0377, timezone: 'America/New_York', elevation: 15 },
      { iata: 'ATL', icao: 'KATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'US', lat: 33.6407, lon: -84.4277, timezone: 'America/New_York', elevation: 1026 },
      { iata: 'LHR', icao: 'EGLL', name: 'London Heathrow', city: 'London', country: 'GB', lat: 51.4700, lon: -0.4543, timezone: 'Europe/London', elevation: 83 },
      { iata: 'CDG', icao: 'LFPG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'FR', lat: 49.0097, lon: 2.5479, timezone: 'Europe/Paris', elevation: 392 },
      { iata: 'NRT', icao: 'RJAA', name: 'Tokyo Narita International', city: 'Tokyo', country: 'JP', lat: 35.7647, lon: 140.3864, timezone: 'Asia/Tokyo', elevation: 141 },
      { iata: 'DXB', icao: 'OMDB', name: 'Dubai International', city: 'Dubai', country: 'AE', lat: 25.2532, lon: 55.3657, timezone: 'Asia/Dubai', elevation: 62 },
      { iata: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'CA', lat: 43.6777, lon: -79.6248, timezone: 'America/Toronto', elevation: 569 },
    ],
  });

  const ap = Object.fromEntries(airports.map(a => [a.iata, a]));

  // ── Flights ────────────────────────────────────────────────
  await prisma.flight.createMany({
    data: [
      // Active en-route flights over / near NYC
      {
        callsign: 'AAL100',  airline: 'American Airlines', flightNumber: 'AA100',  aircraftType: 'B77W', registration: 'N717AN',
        originId: ap.JFK.id, destinationId: ap.LHR.id,
        status: 'EN_ROUTE', departureTime: h(-2), arrivalTime: h(5), actualDep: h(-2),
        lat: 48.2, lon: -35.1, altitude: 38000, groundSpeed: 520, heading: 65, verticalRate: 0, squawk: '2341',
      },
      {
        callsign: 'UAL89',   airline: 'United Airlines',   flightNumber: 'UA89',   aircraftType: 'B789', registration: 'N29971',
        originId: ap.SFO.id, destinationId: ap.NRT.id,
        status: 'EN_ROUTE', departureTime: h(-5), arrivalTime: h(7), actualDep: h(-5),
        lat: 51.3, lon: 168.4, altitude: 36000, groundSpeed: 510, heading: 295, verticalRate: 0, squawk: '5501',
      },
      {
        callsign: 'DAL415',  airline: 'Delta Air Lines',   flightNumber: 'DL415',  aircraftType: 'A321', registration: 'N303DN',
        originId: ap.BOS.id, destinationId: ap.JFK.id,
        status: 'EN_ROUTE', departureTime: m(-45), arrivalTime: m(15), actualDep: m(-45),
        lat: 41.4, lon: -72.1, altitude: 12000, groundSpeed: 320, heading: 215, verticalRate: -800, squawk: '3304',
      },
      {
        callsign: 'BAW112',  airline: 'British Airways',   flightNumber: 'BA112',  aircraftType: 'B788', registration: 'G-ZBJA',
        originId: ap.LHR.id, destinationId: ap.JFK.id,
        status: 'DELAYED', departureTime: h(-7), arrivalTime: h(0.5), actualDep: h(-6), delayMinutes: 55,
        lat: 42.8, lon: -56.7, altitude: 37000, groundSpeed: 495, heading: 250, verticalRate: 0, squawk: '1203',
      },
      {
        callsign: 'EIN104',  airline: 'Aer Lingus',        flightNumber: 'EI104',  aircraftType: 'A330', registration: 'EI-GEY',
        originId: ap.JFK.id, destinationId: ap.LHR.id,
        status: 'EN_ROUTE', departureTime: h(-3), arrivalTime: h(4), actualDep: h(-3),
        lat: 52.1, lon: -20.5, altitude: 37000, groundSpeed: 480, heading: 68, verticalRate: 0, squawk: '4421',
      },
      {
        callsign: 'AAL2',    airline: 'American Airlines', flightNumber: 'AA2',    aircraftType: 'B77W', registration: 'N351AA',
        originId: ap.LAX.id, destinationId: ap.JFK.id,
        status: 'EN_ROUTE', departureTime: h(-4.5), arrivalTime: h(0.5), actualDep: h(-4.5),
        lat: 39.4, lon: -89.2, altitude: 37000, groundSpeed: 505, heading: 82, verticalRate: 0, squawk: '2201',
      },
      {
        callsign: 'UAL1',    airline: 'United Airlines',   flightNumber: 'UA1',    aircraftType: 'B739', registration: 'N37293',
        originId: ap.ORD.id, destinationId: ap.JFK.id,
        status: 'DELAYED', departureTime: h(-2), arrivalTime: h(0.75), actualDep: h(-1.5), delayMinutes: 30,
        lat: 41.1, lon: -79.3, altitude: 35000, groundSpeed: 470, heading: 100, verticalRate: 0, squawk: '5522',
      },
      {
        callsign: 'JBU501',  airline: 'JetBlue Airways',  flightNumber: 'B6501',  aircraftType: 'A320', registration: 'N779JB',
        originId: ap.JFK.id, destinationId: ap.MIA.id,
        status: 'EN_ROUTE', departureTime: h(-1.5), arrivalTime: h(1), actualDep: h(-1.5),
        lat: 35.2, lon: -78.4, altitude: 36000, groundSpeed: 460, heading: 190, verticalRate: 0, squawk: '6612',
      },
      {
        callsign: 'AFR007',  airline: 'Air France',        flightNumber: 'AF7',    aircraftType: 'B77W', registration: 'F-GSQJ',
        originId: ap.CDG.id, destinationId: ap.JFK.id,
        status: 'EN_ROUTE', departureTime: h(-5), arrivalTime: h(2), actualDep: h(-5),
        lat: 44.9, lon: -47.2, altitude: 39000, groundSpeed: 525, heading: 258, verticalRate: 0, squawk: '3301',
      },
      {
        callsign: 'EAL550',  airline: 'Emirates',          flightNumber: 'EK550',  aircraftType: 'A380', registration: 'A6-EDS',
        originId: ap.DXB.id, destinationId: ap.JFK.id,
        status: 'EN_ROUTE', departureTime: h(-11), arrivalTime: h(1.5), actualDep: h(-11),
        lat: 46.3, lon: -25.8, altitude: 41000, groundSpeed: 540, heading: 300, verticalRate: 0, squawk: '7701',
      },
      // Landed / on ground
      {
        callsign: 'DAL401',  airline: 'Delta Air Lines',   flightNumber: 'DL401',  aircraftType: 'A321', registration: 'N391DN',
        originId: ap.ATL.id, destinationId: ap.JFK.id,
        status: 'LANDED', departureTime: h(-3), arrivalTime: h(-0.5), actualDep: h(-3), actualArr: h(-0.4),
        lat: 40.6413, lon: -73.7781, altitude: 0, groundSpeed: 0, heading: 0, onGround: true, squawk: '0000', gate: 'B22', terminal: '4',
      },
      {
        callsign: 'SWA1234', airline: 'Southwest Airlines',flightNumber: 'WN1234', aircraftType: 'B737', registration: 'N8815L',
        originId: ap.LGA.id, destinationId: ap.DCA.id,
        status: 'BOARDING', departureTime: h(0.5), arrivalTime: h(2),
        lat: 40.7769, lon: -73.8740, altitude: 0, groundSpeed: 0, heading: 0, onGround: true, squawk: '0000', gate: 'D3', terminal: 'C',
      },
      {
        callsign: 'AAL300',  airline: 'American Airlines', flightNumber: 'AA300',  aircraftType: 'A321', registration: 'N121AA',
        originId: ap.JFK.id, destinationId: ap.LAX.id,
        status: 'CANCELLED',departureTime: h(1), arrivalTime: h(7), delayMinutes: 0,
        lat: 40.6413, lon: -73.7781, altitude: 0, groundSpeed: 0, heading: 0, onGround: true, squawk: '0000', gate: 'T3', terminal: '8',
      },
      {
        callsign: 'JAL006',  airline: 'Japan Airlines',    flightNumber: 'JL6',    aircraftType: 'B77W', registration: 'JA731J',
        originId: ap.NRT.id, destinationId: ap.JFK.id,
        status: 'DIVERTED',  departureTime: h(-14), arrivalTime: h(-1), actualDep: h(-14), delayMinutes: 90,
        lat: 42.3656, lon: -71.0096, altitude: 0, groundSpeed: 0, heading: 0, onGround: true, squawk: '7700', terminal: 'E', gate: 'E11',
      },
      // Near JFK approach
      {
        callsign: 'ACO871',  airline: 'Air Canada',        flightNumber: 'AC871',  aircraftType: 'B789', registration: 'C-FVLQ',
        originId: ap.YYZ.id, destinationId: ap.JFK.id,
        status: 'EN_ROUTE', departureTime: h(-2), arrivalTime: m(20), actualDep: h(-2),
        lat: 40.8, lon: -73.5, altitude: 4500, groundSpeed: 210, heading: 230, verticalRate: -1200, squawk: '3345',
      },
    ],
  });

  // ── Bike Stations (NYC Citi Bike) ──────────────────────────
  await prisma.bikeStation.createMany({
    data: [
      { stationId: 'citibike-72', name: 'W 52 St & 11 Ave', lat: 40.76727216, lon: -74.00476837, capacity: 39, bikesAvailable: 12, docksAvailable: 27 },
      { stationId: 'citibike-79', name: 'Franklin St & W Broadway', lat: 40.71911552, lon: -74.00666661, capacity: 33, bikesAvailable: 4, docksAvailable: 29 },
      { stationId: 'citibike-82', name: 'St James Pl & Pearl St', lat: 40.71117416, lon: -74.00016545, capacity: 27, bikesAvailable: 0, docksAvailable: 27, isRenting: false },
      { stationId: 'citibike-83', name: 'Atlantic Ave & Fort Greene Pl', lat: 40.68382604, lon: -73.97632328, capacity: 62, bikesAvailable: 38, docksAvailable: 24 },
      { stationId: 'citibike-116', name: 'W 17 St & 8 Ave', lat: 40.74177603, lon: -74.00149746, capacity: 39, bikesAvailable: 7, docksAvailable: 32 },
      { stationId: 'citibike-127', name: 'Barrow St & Hudson St', lat: 40.73172428, lon: -74.00674436, capacity: 31, bikesAvailable: 15, docksAvailable: 16 },
      { stationId: 'citibike-128', name: 'MacDougal St & Prince St', lat: 40.72710258, lon: -74.00451887, capacity: 30, bikesAvailable: 2, docksAvailable: 28, isRenting: false },
      { stationId: 'citibike-143', name: 'E 14 St & Irving Pl', lat: 40.73475, lon: -73.98765, capacity: 23, bikesAvailable: 18, docksAvailable: 5 },
      { stationId: 'citibike-151', name: 'Cleveland Pl & Spring St', lat: 40.72247, lon: -73.99726, capacity: 19, bikesAvailable: 11, docksAvailable: 8 },
      { stationId: 'citibike-161', name: 'LaGuardia Pl & W 3 St', lat: 40.7261, lon: -73.99800, capacity: 35, bikesAvailable: 29, docksAvailable: 6 },
      { stationId: 'citibike-164', name: 'E 47 St & 2 Ave', lat: 40.75323098, lon: -73.9699498, capacity: 47, bikesAvailable: 33, docksAvailable: 14 },
      { stationId: 'citibike-167', name: 'E 39 St & 3 Ave', lat: 40.74804, lon: -73.97641, capacity: 35, bikesAvailable: 0, docksAvailable: 35, isRenting: false },
      { stationId: 'citibike-173', name: 'Broadway & W 49 St', lat: 40.76087502, lon: -73.98398401, capacity: 55, bikesAvailable: 41, docksAvailable: 14 },
      { stationId: 'citibike-195', name: 'Liberty St & Broadway', lat: 40.70905, lon: -74.01043, capacity: 41, bikesAvailable: 8, docksAvailable: 33 },
      { stationId: 'citibike-212', name: 'W 16 St & The High Line', lat: 40.74396, lon: -74.00429, capacity: 51, bikesAvailable: 44, docksAvailable: 7 },
      { stationId: 'citibike-243', name: 'Fulton St & Rockefeller Plz', lat: 40.71165, lon: -74.01066, capacity: 33, bikesAvailable: 21, docksAvailable: 12 },
      { stationId: 'citibike-252', name: 'MacDougal St & Washington Sq', lat: 40.73235, lon: -74.00033, capacity: 34, bikesAvailable: 17, docksAvailable: 17 },
      { stationId: 'citibike-285', name: 'Broadway & E 14 St', lat: 40.73454, lon: -73.99074, capacity: 49, bikesAvailable: 3, docksAvailable: 46, isRenting: false },
      { stationId: 'citibike-293', name: 'Lafayette St & E 8 St', lat: 40.72952, lon: -73.99148, capacity: 27, bikesAvailable: 24, docksAvailable: 3 },
      { stationId: 'citibike-327', name: 'Vesey Pl & River Terrace', lat: 40.71551, lon: -74.01677, capacity: 30, bikesAvailable: 16, docksAvailable: 14 },
      { stationId: 'citibike-328', name: 'Watts St & Greenwich St', lat: 40.72415, lon: -74.00918, capacity: 21, bikesAvailable: 9, docksAvailable: 12 },
      { stationId: 'citibike-347', name: 'Greenwich Ave & 8 Ave', lat: 40.7390169, lon: -74.0026921, capacity: 31, bikesAvailable: 14, docksAvailable: 17 },
      { stationId: 'citibike-359', name: 'E 47 St & Park Ave', lat: 40.75510, lon: -73.97634, capacity: 68, bikesAvailable: 52, docksAvailable: 16 },
      { stationId: 'citibike-360', name: 'William St & Pine St', lat: 40.70758, lon: -74.00842, capacity: 35, bikesAvailable: 28, docksAvailable: 7 },
      { stationId: 'citibike-368', name: 'Carmine St & 6 Ave', lat: 40.7284, lon: -74.00296, capacity: 30, bikesAvailable: 1, docksAvailable: 29, isRenting: false },
      { stationId: 'citibike-379', name: 'W 31 St & 7 Ave', lat: 40.74872, lon: -73.99782, capacity: 55, bikesAvailable: 19, docksAvailable: 36 },
      { stationId: 'citibike-402', name: 'Broadway & W 60 St', lat: 40.76915, lon: -73.98192, capacity: 35, bikesAvailable: 30, docksAvailable: 5 },
      { stationId: 'citibike-406', name: 'Hicks St & Montague St', lat: 40.69512, lon: -73.99595, capacity: 33, bikesAvailable: 22, docksAvailable: 11 },
      { stationId: 'citibike-411', name: 'E 6 St & Avenue B', lat: 40.72258, lon: -73.97891, capacity: 27, bikesAvailable: 13, docksAvailable: 14 },
      { stationId: 'citibike-422', name: 'W 59 St & 10 Ave', lat: 40.77149, lon: -73.99048, capacity: 39, bikesAvailable: 7, docksAvailable: 32 },
    ],
  });

  // ── Subway Lines ───────────────────────────────────────────
  const subwayLines = await prisma.subwayLine.createManyAndReturn({
    data: [
      { lineId: '1', name: '1 Train', color: '#EE352E', status: 'GOOD_SERVICE' },
      { lineId: '2', name: '2 Train', color: '#EE352E', status: 'DELAYS', statusText: 'Delays due to earlier signal problems at 14 St' },
      { lineId: '3', name: '3 Train', color: '#EE352E', status: 'GOOD_SERVICE' },
      { lineId: '4', name: '4 Train', color: '#00933C', status: 'GOOD_SERVICE' },
      { lineId: '5', name: '5 Train', color: '#00933C', status: 'PLANNED_WORK', statusText: 'No service between Fulton St and Atlantic Av-Barclays Ctr this weekend' },
      { lineId: '6', name: '6 Train', color: '#00933C', status: 'GOOD_SERVICE' },
      { lineId: '7', name: '7 Train', color: '#B933AD', status: 'GOOD_SERVICE' },
      { lineId: 'A', name: 'A Train', color: '#0039A6', status: 'SERVICE_CHANGE', statusText: 'Running express, skipping stops between 59 St-Columbus Circle and 125 St' },
      { lineId: 'C', name: 'C Train', color: '#0039A6', status: 'PLANNED_WORK', statusText: 'No service. Take A or E trains' },
      { lineId: 'E', name: 'E Train', color: '#0039A6', status: 'GOOD_SERVICE' },
      { lineId: 'N', name: 'N Train', color: '#FCCC0A', status: 'GOOD_SERVICE' },
      { lineId: 'Q', name: 'Q Train', color: '#FCCC0A', status: 'DELAYS', statusText: 'Delays in both directions due to track work at Canal St' },
      { lineId: 'R', name: 'R Train', color: '#FCCC0A', status: 'GOOD_SERVICE' },
      { lineId: 'B', name: 'B Train', color: '#FF6319', status: 'GOOD_SERVICE' },
      { lineId: 'D', name: 'D Train', color: '#FF6319', status: 'GOOD_SERVICE' },
      { lineId: 'F', name: 'F Train', color: '#FF6319', status: 'GOOD_SERVICE' },
      { lineId: 'G', name: 'G Train', color: '#6CBE45', status: 'PLANNED_WORK', statusText: 'Reduced frequency on weekends' },
      { lineId: 'J', name: 'J Train', color: '#996633', status: 'GOOD_SERVICE' },
      { lineId: 'L', name: 'L Train', color: '#A7A9AC', status: 'SUSPENDED', statusText: 'No service between Bedford Av and 1 Av due to track fire', affectedFrom: m(-30) },
      { lineId: 'Z', name: 'Z Train', color: '#996633', status: 'GOOD_SERVICE' },
      { lineId: 'S', name: 'S Shuttle', color: '#808183', status: 'GOOD_SERVICE' },
    ],
  });

  const lineMap = Object.fromEntries(subwayLines.map(l => [l.lineId, l]));

  // ── Subway Trains ──────────────────────────────────────────
  await prisma.subwayTrain.createMany({
    data: [
      { trainId: 'T001', lineId: '1', direction: 'N', currentStop: '14 St', nextStop: '18 St', status: 'IN_TRANSIT', lat: 40.7378, lon: -73.9994 },
      { trainId: 'T002', lineId: '1', direction: 'S', currentStop: 'Times Sq-42 St', nextStop: '34 St-Penn Station', status: 'AT_STATION', lat: 40.7557, lon: -73.9871 },
      { trainId: 'T003', lineId: '2', direction: 'N', currentStop: 'Chambers St', nextStop: 'Fulton St', status: 'DELAYED', delay: 8, lat: 40.7139, lon: -74.0089 },
      { trainId: 'T004', lineId: '4', direction: 'N', currentStop: 'Grand Central-42 St', nextStop: '51 St', status: 'IN_TRANSIT', lat: 40.7527, lon: -73.9772 },
      { trainId: 'T005', lineId: '6', direction: 'S', currentStop: '86 St', nextStop: '77 St', status: 'IN_TRANSIT', lat: 40.7774, lon: -73.9549 },
      { trainId: 'T006', lineId: 'A', direction: 'S', currentStop: '125 St', nextStop: '59 St-Columbus Circle', status: 'IN_TRANSIT', lat: 40.8107, lon: -73.9497 },
      { trainId: 'T007', lineId: 'E', direction: 'N', currentStop: '23 St', nextStop: '28 St', status: 'AT_STATION', lat: 40.7426, lon: -73.9923 },
      { trainId: 'T008', lineId: 'N', direction: 'S', currentStop: 'Times Sq-42 St', nextStop: '34 St-Herald Sq', status: 'IN_TRANSIT', lat: 40.7553, lon: -73.9877 },
      { trainId: 'T009', lineId: 'Q', direction: 'N', currentStop: 'Canal St', nextStop: 'City Hall', status: 'DELAYED', delay: 12, lat: 40.7187, lon: -74.0002 },
      { trainId: 'T010', lineId: 'F', direction: 'N', currentStop: '34 St-Herald Sq', nextStop: '42 St-Bryant Park', status: 'IN_TRANSIT', lat: 40.7496, lon: -73.9878 },
      { trainId: 'T011', lineId: '7', direction: 'E', currentStop: 'Queensboro Plz', nextStop: 'Court Sq', status: 'IN_TRANSIT', lat: 40.7504, lon: -73.9446 },
      { trainId: 'T012', lineId: 'B', direction: 'N', currentStop: 'West 4 St', nextStop: 'Broadway-Lafayette St', status: 'AT_STATION', lat: 40.7323, lon: -74.0002 },
      { trainId: 'T013', lineId: 'D', direction: 'S', currentStop: '47-50 Sts-Rockefeller Ctr', nextStop: '42 St-Bryant Park', status: 'IN_TRANSIT', lat: 40.7587, lon: -73.9812 },
      { trainId: 'T014', lineId: 'G', direction: 'S', currentStop: 'Metropolitan Av', nextStop: 'Broadway', status: 'IN_TRANSIT', lat: 40.7135, lon: -73.9511 },
      { trainId: 'T015', lineId: 'J', direction: 'M', currentStop: 'Marcy Av', nextStop: 'Hewes St', status: 'IN_TRANSIT', lat: 40.7080, lon: -73.9577 },
    ],
  });

  // ── Watchlist ──────────────────────────────────────────────
  const flights = await prisma.flight.findMany({ where: { callsign: { in: ['AAL100', 'BAW112', 'EAL550'] } } });
  const flightMap = Object.fromEntries(flights.map(f => [f.callsign, f]));

  const watchItems = await prisma.watchlistItem.createManyAndReturn({
    data: [
      { type: 'FLIGHT',       label: 'AA100 · JFK→LHR',   refId: 'AAL100', notes: 'Business trip to London', flightId: flightMap['AAL100']?.id },
      { type: 'FLIGHT',       label: 'BA112 · LHR→JFK',   refId: 'BAW112', notes: 'Return flight — watch for delays', flightId: flightMap['BAW112']?.id },
      { type: 'FLIGHT',       label: 'EK550 · DXB→JFK',   refId: 'EAL550', notes: 'Picking up from JFK', flightId: flightMap['EAL550']?.id },
      { type: 'BIKE_STATION', label: 'W 52 St & 11 Ave',   refId: 'citibike-72',  notes: 'Near office' },
      { type: 'BIKE_STATION', label: 'E 47 St & Park Ave', refId: 'citibike-359', notes: 'Commute station' },
      { type: 'SUBWAY_LINE',  label: 'L Train',            refId: 'L',            notes: 'Daily commute — check for weekend work' },
      { type: 'SUBWAY_LINE',  label: 'Q Train',            refId: 'Q',            notes: 'Alternate route to work' },
      { type: 'AIRPORT',      label: 'JFK International',  refId: 'JFK',          notes: 'Home airport' },
    ],
  });

  // ── Alerts ─────────────────────────────────────────────────
  const baw112 = await prisma.flight.findUnique({ where: { callsign: 'BAW112' } });
  const jal006 = await prisma.flight.findUnique({ where: { callsign: 'JAL006' } });
  const watchFlight1 = watchItems.find(w => w.refId === 'BAW112');
  const watchLine = watchItems.find(w => w.refId === 'L');

  await prisma.alert.createMany({
    data: [
      {
        type: 'DELAY', severity: 'WARNING',
        title: 'BA112 Delayed 55 Minutes',
        body: 'British Airways flight BA112 from London Heathrow is now estimated to arrive at 14:35 EST, 55 minutes behind schedule due to late departure.',
        flightId: baw112?.id,
        watchlistItemId: watchFlight1?.id,
      },
      {
        type: 'DIVERSION', severity: 'CRITICAL',
        title: 'JL6 Diverted to Boston',
        body: 'Japan Airlines flight JL6 from Tokyo Narita has been diverted to Boston Logan (BOS) due to a medical emergency onboard. Passengers will be rebooked.',
        flightId: jal006?.id,
      },
      {
        type: 'SUBWAY_SUSPENSION', severity: 'CRITICAL',
        title: 'L Train Suspended — Track Fire at 1 Av',
        body: 'L Train service suspended between Bedford Av and 1 Av due to a track fire at 1 Av station. Use M14A/D buses or transfer to A/C/E at 14 St-8 Av.',
        watchlistItemId: watchLine?.id,
      },
      {
        type: 'LOW_BIKES', severity: 'INFO',
        title: 'Low Availability: MacDougal St & Prince St',
        body: 'Only 2 bikes remaining at MacDougal St & Prince St (station citibike-128). Nearest alternatives: LaGuardia Pl & W 3 St (29 bikes) or Carmine St & 6 Ave.',
      },
      {
        type: 'CANCELLATION', severity: 'CRITICAL',
        title: 'AA300 Cancelled — JFK→LAX',
        body: 'American Airlines flight AA300 has been cancelled due to mechanical issues. Affected passengers should contact AA customer service or rebook through the app.',
      },
      {
        type: 'INFO', severity: 'INFO',
        title: 'EK550 On Final Approach',
        body: 'Emirates flight EK550 from Dubai is on final approach to JFK. Estimated touchdown in 90 minutes. Terminal 4, Baggage Claim B.',
        read: true,
      },
    ],
  });

  console.log('✓ Seeded VECTOR database:');
  console.log(`  - ${airports.length} airports`);
  console.log(`  - ${await prisma.flight.count()} flights`);
  console.log(`  - ${await prisma.bikeStation.count()} bike stations`);
  console.log(`  - ${subwayLines.length} subway lines`);
  console.log(`  - ${await prisma.subwayTrain.count()} subway trains`);
  console.log(`  - ${await prisma.watchlistItem.count()} watchlist items`);
  console.log(`  - ${await prisma.alert.count()} alerts`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
