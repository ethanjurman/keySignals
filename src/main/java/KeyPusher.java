import java.awt.*;

public class KeyPusher {
  Robot r;

  KeyPusher() throws AWTException {
    this.r = new Robot();
  }

  int pushKey(int keyCode) throws AWTException, InterruptedException {
    System.out.println("push: " + keyCode);
    this.r.keyPress(keyCode);
    return keyCode;
  }

  int releaseKey(int keyCode) throws AWTException, InterruptedException {
    System.out.println("release: " + keyCode);
    this.r.keyRelease(keyCode);
    return keyCode;
  }
}
