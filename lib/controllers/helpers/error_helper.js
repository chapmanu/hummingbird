module.exports = {
  
  handle: function(res, error) {
    if (error.BadQuery || error.ValidationError) {
      res.json({error: "Bad Request: Request parameters are malformed."}, 400);
    } else
    if (error.ModelExists) {
      res.json({error: "Conflict: Model already exists with these attributes."}, 409);
    } else
    if (error.ModelExists===false) {
      res.json({error: "Conflict: Model does not exist."}, 409);
    } else {
      res.json({error: "Internal Server Error"}, 500);
    }
  },
  
  noMethod: function(res) {
    res.json({error: "Method Not Allowed: This method does not exist."},405);
  }
  
};