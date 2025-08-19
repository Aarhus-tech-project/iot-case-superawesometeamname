# Requirement specs
## Funktionelle krav:

#### Måling af bevægelse:
- Trackeren skal kunne registrere antal skridt via gyro/accelerometer.
- Trackeren skal beregne distance (km) baseret på skridt og skridtlængde.

#### Måling af puls:
- Trackeren skal kunne registrere brugerens hjerterytme i realtid.

#### Energiforbrug:
- Systemet skal kunne beregne kalorieforbrug baseret på puls, bevægelse og brugerdata (vægt, højde, alder, køn).

#### BMI-beregning:
- Backend skal kunne udregne BMI baseret på brugerens vægt og højde.

#### Dataopsamling:
- Trackeren skal kunne gemme data lokalt, indtil den kan sende til backend.
- Data skal kunne overføres trådløst (f.eks. via Bluetooth eller Wi-Fi) til backend.

#### Datahåndtering i backend:
- Backend skal gemme data i en database.
- Backend skal kunne behandle rådata og udregne fitness-metrikker (distance, energiforbrug, skridt osv.).
- Brugeren skal kunne indtaste personlige data (vægt, højde, alder, køn).

#### Brugerinterface:
- Backend skal præsentere data via en website.
- Brugeren skal kunne se både rå målinger (skridt, puls) og beregnede værdier (distance, kalorier, BMI).

## Ikke-funktionelle krav:

#### Størrelse og vægt:
- Trackeren skal være lille og let nok til at kunne bæres komfortabelt på håndleddet.

#### Skalerbarhed:
- Backend skal kunne håndtere data fra flere trackere på samme tid.