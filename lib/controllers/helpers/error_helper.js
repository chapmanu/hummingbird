module.exports = {
  
  handle: function(res, error) {
    if (error.BadQuery || error.ValidationError) {
      res.status(400).json({error: "Bad Request: Request parameters are malformed."});
    } else
    if (error.ModelExists) {
      res.status(409).json({error: "Conflict: Model already exists with these attributes."});
    } else
    if (error.ModelExists===false) {
      res.status(409).json({error: "Conflict: Model does not exist."});
    } else {
      res.status(500).json({error: "Internal Server Error"});
    }
  },
  
  noMethod: function(res) {
    res.status(405).json({error: "Method Not Allowed: This method does not exist."});
  }
  
};