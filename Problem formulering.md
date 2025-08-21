## Problem formulering
Hvordan kan vi udvikle en kompakt og brugervenlig wearable fitness tracker, der kan måle og registrere brugerens bevægelser og helbredsdata, lagre disse lokalt og trådløst overføre dem til en backend, hvor dataene gemmes, behandles og præsenteres på en overskuelig måde for brugeren?

### Underordnede spørgsmål:

- Hvilke sensorer er nødvendige for at kunne måle bevægelser, puls og andre fitnessdata pålideligt? <br />
Accelerometer (Bevægelse & skridt), Gyroskop (rotation & præcision), pulssensor og GPS

- Hvordan kan data lagres lokalt? <br />
Vi vil gemme dataen via et eksternt SD Kort.

- Hvordan bliver dataen sendt til databasen? <br />
dataen bliver sendt til MQTT brokeren via Wifi, når wifi kan forbindes. MQTT brokeren sender dataen videre til vores database.
Vores database er sat op med MySql.

- Hvordan kan brugerens personlige data (vægt, højde, alder osv.) integreres i beregninger som kalorieforbrug og BMI? <br />
Kalorieforbrug og BMi bliver beregnet via velkendte formler som vi finder online.

- Hvordan kan data præsenteres på en brugervenlig måde? <br />
En forside med et dashboard-visning (grafer)  vil vise de vigtigste detajler som skridt, distance, puls osv.
Dertil farvekode som kan hjælpe.
Vi laver også en profil side hvor brugeren kan håndtere deres input (vægt, højde osv.)

- Hvilke tekniske og fysiske begrænsninger (størrelse, batteri, ydeevne) skal tages i betragtning ved design af trackeren? <br />
Trackeren skal være så let, kompakt og behagelig som muligt, dog er det svært at opnå da skolen ikke helt har det påkrævet udstyr.
Vores største bekymkring er at gøre produktet kompakt ift. sensorer + strømforsyning.