package de.timnoy.noystack.it;

import de.timnoy.noystack.config.TestContainerConfig;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Import(TestContainerConfig.class)
@AutoConfigureMockMvc
@ActiveProfiles("it-test")
abstract class AbstractIT {
}
