import java.awt.*;

public class KeyPusher {
  Robot r;

  KeyPusher() throws AWTException {
    this.r = new Robot();
  }

  int pushKey(String key) throws AWTException, InterruptedException {
    System.out.println("push: " + key);
    int keyCode = key.charAt(0);
    this.r.keyPress(keyCode);
    return keyCode;
  }

  int releaseKey(String key) throws AWTException, InterruptedException {
    System.out.println("release: " + key);
    int keyCode = key.charAt(0);
    this.r.keyRelease(keyCode);
    return keyCode;
  }
}
