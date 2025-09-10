#### Routes
We ran into issues with route files becoming too large and hard to manage. To fix this, we split the routes into separate files and introduced "processor" files. <br />
Now, each route calls a processor that handles all the data logic, keeping the route files clean and focused on request handling.

#### MySql queries
Doing mysql queries manually is a bit troublesome and will make the codebase larger for pratical no reason. <br />
To get away from doing this a new class has been added: DBContext. <br />
With this DBContext we just import it and can easily run both standard & named queries using simple functions instead of calling alot of code to get the same result. <br />

#### Named DB Queries
To begin with mysql2 for node does not support named queries, we could've just easily done it using '?' in the sql instead.<br />
But since having too many ?'s in a single query can be quite difficult to read, we've introduced 3 extra functions besides the query & exec functionality.<br />
The 3 new functions are namedQuery, namedExec & formatNamedSql, these functions allow us to used named queries instead of only ? queries making readability better.

#### Creating users - Pt 1
Issue with creating users, specifically on the part that would hash passwords. <br />
Forgot a critical await when calling the hashing functionality which would cause a buffer to be inputted into the mysql query instead of the actual hashed password

#### Code
For the backend and mqtt broker we've decided to go with NodeJS server in version 20.11.0. <br />
Reasoning for the MQTT subscriber is since we've already made one in C++ earlier, and thought that would be too easy to just copypaste the C++ code, so wanted to try something new. <br />
Therefore we went to route of making it in NodeJS with Typescript, which had it differences but was quite easy to setup and didnt take long with the "aedes" node package. <br />
The backend is spun up using express server, but with typescript instead of javascript. This is done to have more control of the types & readability of the code so we know exactly what a object contains.

#### MQTT JSON Payload
We ran into multiple issues with sending a JSON payload to the mqtt broker, these were fixed on the arduino side and the MQTT broker was modified to support the changes.

#### MQTT Message receiver
Originally this was thought to be a comma seperated string with the values, but was later changed to a JSON payload. <br />
The MQTT broker has changed and adapted to the JSON payload instead, which gives a way cleaner readability.