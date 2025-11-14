package utez.edu.mx.sguargc10d.modules.test;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/adj-api/test")
@CrossOrigin(origins = "*")
public class TestController {
    @GetMapping("")
    public ResponseEntity<?> getMessage(){
        HashMap<String, Object> response = new HashMap<>();
        response.put("data", "ok");
        response.put("message", "API Funcionando");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
