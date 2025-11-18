package mx.edu.utez.server.test;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/adj-api")
@CrossOrigin(origins = "*")
public class TestController {
    @GetMapping("/test")
    public ResponseEntity<?> getMessage() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("data", "Ok");
        response.put("message", "API funcionando");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
