# Equipment-Store-Server
## Live link: https://equipment-store-server.vercel.app/ 
## Five points: 

### 1: Parses the sort query parameter from the request to determine ascending (1) or descending (-1) sorting.
### 2. Utilizes MongoDB's .sort() method to sort data by the price field based on the query parameter.
### 3. Includes default sorting (1) and slice (6) values to handle missing query parameters.
### 4.  Implements a try-catch block to gracefully handle database errors and return meaningful responses.
### 5. Supports additional query parameters like slice for customizable result counts.