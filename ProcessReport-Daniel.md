#### Routes
Issues with routes taking up too much space, solution was to splitup routes into different files aswell as making "processor" files for the route so the route calls the processor which then does all data handling.

#### MySql queries
Doing mysql queries manually is a bit troublesome and will make the codebase larger for pratical no reason. <br />
To get away from doing this a new class has been added: DBContext. <br />
With this DBContext we just import it and can easily run both standard & named queries using simple functions instead of calling alot of code to get the same result. <br />

#### Named DB Queries
To begin with mysql2 for node does not support named queries, we could've just easily done it using '?' in the sql instead.<br />
But since having too many ?'s in a single query can be quite difficult to read, we've introduced 3 extra functions besides the query & exec functionality.<br />
The 3 new functions are namedQuery, namedExec & formatNamedSql, these functions allow us to used named queries instead of only ? queries making readability better.