import java.awt.*;

import static spark.Spark.*;

public class KeyReceiver {
  public static void main(String[] args) throws AWTException {
    exception(Exception.class, (e, req, res) -> e.printStackTrace());
    KeyPusher kp = new KeyPusher();
    staticFiles.location("/public");
    port(2229);
    get("/keyDown/:key", (req, res) -> kp.pushKey(req.params("key")));
    get("/keyUp/:key", (req, res) -> kp.releaseKey(req.params("key")));
    System.out.println("I'm listening");
  }
}