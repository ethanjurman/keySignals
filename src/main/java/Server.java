import java.awt.*;

import static spark.Spark.*;

public class Server {
  public static void main(String[] args) throws AWTException {
    exception(Exception.class, (e, req, res) -> e.printStackTrace());
    KeyPusher kp = new KeyPusher();
    // staticFiles.location("/public");
    port(2228);
    get("/keyDown/:key", (req, res) -> kp.pushKey(Integer.parseInt(req.params("key"))));
    get("/keyUp/:key", (req, res) -> kp.releaseKey(Integer.parseInt(req.params("key"))));
    System.out.println("Server running on port 2228");
  }
}