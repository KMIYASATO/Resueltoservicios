# DOCUMENTO FUNCIONAL Y TÉCNICO MAESTRO — RESUELTO

**Versión:** 1.0  
**Estado:** Definición base para revisión y ejecución por OpenCode  
**Proyecto:** Resuelto  
**Tipo de producto:** Marketplace de servicios a domicilio  
**Mercado inicial:** Lima Metropolitana, Perú  
**Idioma inicial:** Español  
**Moneda inicial:** PEN (S/)  
**Responsable de desarrollo:** OpenCode  
**Documento relacionado:** `docs/BRAND_BOOK_RESUELTO.md`

---

# 0. INSTRUCCIÓN OBLIGATORIA PARA OPENCODE

Este documento es la **fuente principal de definición funcional y técnica** de Resuelto.

OpenCode debe:

1. Leer completamente este documento antes de modificar o crear código.
2. Leer también `docs/BRAND_BOOK_RESUELTO.md`.
3. No iniciar desarrollo hasta presentar el plan solicitado en la sección final.
4. No copiar código, diseño, textos, recursos ni componentes de Webel u otra plataforma.
5. Utilizar únicamente librerías gratuitas y de código abierto aprobadas.
6. No exponer claves privadas, secretos, contraseñas ni credenciales en frontend, repositorio, logs o documentación.
7. No desactivar Row Level Security para resolver errores.
8. No usar `service_role` en el navegador.
9. No ejecutar migraciones destructivas en producción sin aprobación explícita.
10. No modificar KenjiPocket. Resuelto debe vivir en un proyecto independiente.

**Ubicación recomendada:**

```text
/docs/DOCUMENTO_FUNCIONAL_TECNICO_RESUELTO.md
```

---

# 1. VISIÓN DEL PRODUCTO

## 1.1 Qué es Resuelto

Resuelto será un marketplace peruano de servicios a domicilio que permitirá a una persona:

1. Buscar el servicio que necesita.
2. Indicar su ubicación.
3. Comparar profesionales.
4. Revisar precio, experiencia, valoración y disponibilidad.
5. Elegir fecha y hora.
6. Reservar.
7. Pagar de forma segura.
8. Comunicarse con el profesional.
9. Hacer seguimiento del servicio.
10. Confirmar la finalización.
11. Calificar la experiencia.

## 1.2 Promesa principal

> Encontrar, comparar y reservar profesionales confiables desde un solo lugar.

## 1.3 Idea central

> Tu problema ya está encaminado.

## 1.4 Diferencia frente a un directorio

Resuelto no será una lista de teléfonos ni una página de anuncios.

Resuelto gestionará:

- búsqueda;
- comparación;
- reputación;
- agenda;
- reserva;
- pagos;
- estados del servicio;
- comunicación;
- cancelaciones;
- reclamos;
- liquidaciones;
- soporte;
- herramientas para profesionales.

---

# 2. OBJETIVOS DEL MVP

## 2.1 Objetivo comercial

Validar en Lima si clientes y profesionales están dispuestos a operar dentro de una plataforma que centraliza descubrimiento, reserva, reputación y pago.

## 2.2 Objetivo técnico

Construir un producto funcional, seguro, mantenible y desplegable utilizando:

- Next.js;
- TypeScript;
- Tailwind CSS;
- Supabase;
- PostgreSQL;
- Supabase Auth;
- Supabase Storage;
- Supabase Realtime;
- Supabase Edge Functions;
- PostgreSQL Functions;
- librerías gratuitas y open source.

## 2.3 Objetivo de seguridad

Garantizar que:

- cada usuario solo acceda a sus datos;
- ningún cliente modifique precios, comisiones o estados críticos;
- ninguna clave privada esté expuesta;
- toda operación sensible quede auditada;
- RLS permanezca activo;
- los pagos futuros utilicen idempotencia y webhooks verificados.

---

# 3. ALCANCE INICIAL

## 3.1 Cobertura

- País: Perú.
- Ciudad inicial: Lima Metropolitana.
- Moneda: PEN.
- Idioma: español.
- Plataforma inicial: web responsive.
- Aplicaciones móviles: fase posterior.

## 3.2 Categorías iniciales

1. Limpieza del hogar.
2. Gasfitería.
3. Electricidad.
4. Armado e instalación.

## 3.3 Fuera del MVP inicial

- múltiples países;
- múltiples monedas;
- apps móviles nativas;
- inteligencia artificial para asignación;
- microservicios;
- Kubernetes;
- pagos reales antes de validar proveedor;
- liquidaciones automáticas sin validación legal;
- sistema propio de autenticación;
- marketplace multiempresa;
- suscripciones complejas;
- facturación electrónica automática;
- sistema de antecedentes automatizado.

---

# 4. ROLES DEL SISTEMA

## 4.1 Cliente

Podrá:

- registrarse;
- confirmar correo;
- iniciar sesión;
- recuperar contraseña;
- completar perfil;
- registrar direcciones;
- buscar servicios;
- elegir ubicación;
- comparar profesionales;
- ver perfiles;
- seleccionar fecha y hora;
- crear una reserva;
- pagar cuando se habilite el proveedor;
- revisar reservas;
- reprogramar;
- cancelar según reglas;
- conversar con el profesional;
- recibir notificaciones;
- confirmar finalización;
- calificar;
- presentar reclamos;
- contactar soporte.

## 4.2 Profesional

Podrá:

- registrarse;
- crear perfil profesional;
- cargar documentos;
- elegir servicios;
- definir tarifas;
- configurar zonas;
- configurar disponibilidad;
- administrar agenda;
- recibir solicitudes;
- aceptar o rechazar;
- ver detalles permitidos;
- chatear con clientes;
- marcar estados operativos;
- consultar ingresos;
- consultar comisiones;
- revisar reputación;
- responder reseñas si se habilita;
- solicitar soporte;
- administrar información pública.

## 4.3 Administrador

Podrá:

- administrar clientes;
- revisar profesionales;
- aprobar o rechazar verificaciones;
- suspender cuentas;
- administrar categorías;
- administrar servicios;
- administrar ciudades y zonas;
- revisar reservas;
- revisar pagos;
- gestionar reembolsos;
- gestionar comisiones;
- gestionar cupones;
- resolver disputas;
- moderar reseñas;
- revisar auditoría;
- consultar métricas;
- configurar reglas operativas.

## 4.4 Soporte

Rol opcional separado del administrador.

Podrá:

- revisar reservas;
- revisar conversaciones cuando exista motivo;
- abrir casos;
- registrar seguimiento;
- escalar disputas;
- no modificar directamente pagos o comisiones.

---

# 5. MODELO DE NEGOCIO

## 5.1 Comisión decreciente

Hipótesis inicial:

| Nivel | Servicios completados | Comisión |
|---|---:|---:|
| Nuevo | 0–5 | 20% |
| Activo | 6–20 | 16% |
| Pro | 21–50 | 12% |
| Experto | 51–100 | 9% |
| Embajador | 101+ | 6% |

Los valores deben ser configurables desde base de datos, no escritos directamente en componentes.

## 5.2 Incentivos para permanencia

El profesional mantiene dentro de Resuelto:

- agenda;
- historial;
- reputación;
- pagos;
- métricas;
- recordatorios;
- zonas;
- clientes recurrentes;
- protección ante cancelaciones;
- nivel y comisión reducida;
- soporte;
- mayor visibilidad.

## 5.3 Regla estratégica

No se buscará evitar la salida de la plataforma únicamente mediante bloqueos.

La estrategia será:

- mejores herramientas;
- mejor reputación;
- menor comisión al crecer;
- protección de pago;
- soporte;
- recurrencia;
- conveniencia.

---

# 6. FLUJOS FUNCIONALES

## 6.1 Registro de cliente

```text
Landing
→ Crear cuenta
→ Ingresar correo y contraseña
→ Aceptar términos
→ Confirmar correo
→ Completar perfil
→ Registrar dirección opcional
→ Ingresar a Home
```

## 6.2 Registro profesional

```text
Landing profesional
→ Crear cuenta
→ Confirmar correo
→ Elegir tipo de profesional
→ Completar perfil
→ Cargar documentos
→ Elegir servicios
→ Definir tarifas
→ Definir zonas
→ Configurar agenda
→ Enviar revisión
→ Estado pendiente
→ Aprobación administrativa
```

## 6.3 Búsqueda

```text
Home
→ Elegir servicio
→ Elegir distrito
→ Elegir fecha
→ Ver resultados
→ Aplicar filtros
→ Comparar
→ Abrir perfil
```

## 6.4 Reserva

```text
Servicio
→ Ubicación
→ Fecha y hora
→ Profesional
→ Detalle del trabajo
→ Dirección
→ Precio calculado
→ Resumen
→ Pago o simulación
→ Confirmación
```

## 6.5 Ejecución del servicio

```text
Reserva confirmada
→ Profesional acepta
→ Profesional en camino
→ Servicio iniciado
→ Servicio finalizado por profesional
→ Confirmación del cliente
→ Reserva completada
→ Reseña
→ Liquidación
```

## 6.6 Cancelación

```text
Reserva
→ Solicitar cancelación
→ Mostrar regla aplicable
→ Confirmar motivo
→ Calcular penalidad
→ Procesar devolución si aplica
→ Actualizar estado
→ Notificar a ambas partes
→ Registrar auditoría
```

## 6.7 Disputa

```text
Reserva
→ Reportar problema
→ Elegir motivo
→ Adjuntar evidencia
→ Crear caso
→ Congelar liquidación si aplica
→ Revisión de soporte
→ Resolución
→ Reembolso o cierre
→ Auditoría
```

---

# 7. ESTADOS PRINCIPALES

## 7.1 Profesional

```text
draft
pending_verification
under_review
approved
rejected
suspended
inactive
```

## 7.2 Reserva

```text
draft
pending_payment
payment_processing
confirmed
accepted
professional_on_the_way
in_progress
completed_by_professional
completed
cancelled_by_customer
cancelled_by_professional
disputed
refunded
closed
```

## 7.3 Pago

```text
created
pending
authorized
paid
failed
cancelled
partially_refunded
refunded
disputed
```

## 7.4 Liquidación

```text
pending
on_hold
eligible
processing
paid
failed
cancelled
```

## 7.5 Revisión

```text
draft
published
hidden
under_review
rejected
```

---

# 8. MÁQUINA DE ESTADOS

Las transiciones deberán estar controladas en backend.

Ejemplos válidos:

```text
confirmed → accepted
accepted → professional_on_the_way
professional_on_the_way → in_progress
in_progress → completed_by_professional
completed_by_professional → completed
```

Ejemplos inválidos:

```text
confirmed → completed
refunded → in_progress
cancelled_by_customer → accepted
completed → pending_payment
```

OpenCode debe crear:

```text
docs/BOOKING_STATE_MACHINE.md
```

Debe incluir:

- estado origen;
- estado destino;
- rol autorizado;
- condiciones;
- efectos secundarios;
- auditoría;
- notificaciones;
- reglas de rollback.

---

# 9. ARQUITECTURA TÉCNICA

## 9.1 Decisión principal

Arquitectura centrada en Supabase, sin FastAPI en el MVP.

```text
Frontend web
Next.js + TypeScript + Tailwind
        ↓
Next.js Server Components
Route Handlers / Server Actions
Supabase Edge Functions
PostgreSQL Functions
        ↓
Supabase
PostgreSQL
Auth
RLS
Storage
Realtime
```

## 9.2 Frontend

Responsable de:

- UI;
- navegación;
- formularios;
- validación inicial;
- SEO;
- estados visuales;
- accesibilidad;
- dashboards;
- consulta de información autorizada.

## 9.3 Backend

Se implementará mediante:

### PostgreSQL Functions

Para:

- operaciones atómicas;
- validación de disponibilidad;
- creación de reserva;
- cálculo de precio;
- cancelación;
- cambio de estado;
- comisión;
- liquidación.

### Supabase Edge Functions

Para:

- webhooks;
- integraciones externas;
- envío de correos;
- notificaciones;
- operaciones sensibles;
- secretos;
- firma de URLs;
- tareas administrativas controladas.

### Next.js Route Handlers / Server Actions

Para:

- orquestación web;
- operaciones del servidor;
- validación de sesión;
- endpoints propios cuando sea necesario;
- nunca para exponer secretos al cliente.

---

# 10. REGLA DE ACCESO A DATOS

## 10.1 Acceso directo permitido desde navegador

Solo operaciones simples y protegidas con RLS:

- registro e inicio de sesión;
- lectura de catálogo activo;
- lectura de perfiles públicos;
- lectura de reservas propias;
- edición de perfil propio;
- mensajes dentro de reserva propia;
- carga de archivos autorizados;
- lectura de disponibilidad pública controlada.

## 10.2 Operaciones obligatoriamente protegidas

Deben pasar por función segura:

- crear reserva definitiva;
- calcular precio final;
- aplicar cupón;
- cambiar estado;
- aceptar o rechazar;
- procesar pago;
- registrar reembolso;
- modificar comisión;
- cambiar nivel;
- aprobar profesional;
- resolver disputa;
- crear liquidación;
- alterar información financiera.

---

# 11. MODELO DE DATOS MÍNIMO

## 11.1 Perfiles

```text
profiles
- id uuid PK → auth.users.id
- role
- first_name
- last_name
- phone
- avatar_path
- status
- created_at
- updated_at
```

## 11.2 Direcciones

```text
customer_addresses
- id
- customer_id
- label
- address_line
- district_id
- latitude
- longitude
- reference
- is_default
- created_at
- updated_at
```

## 11.3 Profesionales

```text
professional_profiles
- user_id
- business_name
- profile_type
- biography
- years_experience
- verification_status
- average_rating
- completed_services
- repeat_customers
- current_level_id
- is_active
- created_at
- updated_at
```

## 11.4 Categorías

```text
categories
- id
- name
- slug
- icon_key
- image_path
- sort_order
- is_active
- created_at
- updated_at
```

## 11.5 Servicios

```text
services
- id
- category_id
- name
- slug
- description
- pricing_type
- minimum_duration_minutes
- is_active
- created_at
- updated_at
```

## 11.6 Servicios profesionales

```text
professional_services
- id
- professional_id
- service_id
- price
- minimum_price
- minimum_duration_minutes
- supplies_included
- description
- is_active
- created_at
- updated_at
```

## 11.7 Cobertura

```text
cities
districts
professional_coverage_zones
```

## 11.8 Disponibilidad

```text
availability_rules
availability_exceptions
availability_blocks
```

## 11.9 Reservas

```text
bookings
- id
- customer_id
- professional_id
- service_id
- address_id
- scheduled_start
- scheduled_end
- duration_minutes
- status
- customer_notes
- cancellation_reason
- created_at
- updated_at
```

## 11.10 Snapshot de precio

```text
booking_price_snapshots
- booking_id
- base_amount
- urgency_amount
- materials_amount
- platform_fee
- discount_amount
- tax_amount
- total_amount
- professional_gross
- commission_amount
- professional_net
- currency
- pricing_version
- created_at
```

## 11.11 Pagos

```text
payments
payment_events
refunds
professional_payouts
```

## 11.12 Chat

```text
conversations
conversation_participants
messages
message_attachments
```

## 11.13 Reseñas

```text
reviews
review_moderation_events
```

## 11.14 Disputas

```text
disputes
dispute_evidence
dispute_events
```

## 11.15 Auditoría

```text
audit_events
```

Regla:

- pagos;
- reservas;
- liquidaciones;
- reembolsos;
- disputas;
- auditoría;

no deben eliminarse físicamente.

---

# 12. ESQUEMAS POSTGRESQL

Recomendación:

```text
auth
public
private
billing
messaging
support
audit
storage
```

## 12.1 Public

Contendrá:

- tablas necesarias para la aplicación;
- vistas seguras;
- funciones expresamente expuestas.

## 12.2 Private

Contendrá:

- reglas internas;
- configuraciones;
- datos sensibles;
- tablas no disponibles mediante Data API.

## 12.3 Billing

Contendrá:

- pagos;
- eventos;
- comisiones;
- reembolsos;
- liquidaciones.

## 12.4 Audit

Contendrá:

- eventos críticos;
- trazabilidad;
- cambios de estado;
- acciones administrativas.

---

# 13. AUTENTICACIÓN Y AUTORIZACIÓN

## 13.1 Autenticación

Usar Supabase Auth.

Funciones:

- email y contraseña;
- confirmación de correo;
- recuperación;
- sesiones;
- renovación;
- cierre;
- MFA para administradores.

## 13.2 Roles

No confiar en roles enviados por el navegador.

Los roles deberán:

- almacenarse de forma controlada;
- validarse en servidor;
- no ser editables por el usuario;
- tener políticas RLS específicas.

## 13.3 MFA

Obligatorio para:

- administrador;
- soporte con acceso sensible;
- cualquier rol financiero futuro.

## 13.4 Rate limiting

Aplicar en:

- registro;
- login;
- recuperación;
- envío de mensajes;
- creación de reservas;
- cupones;
- reclamos;
- endpoints sensibles.

---

# 14. ROW LEVEL SECURITY

## 14.1 Regla general

Toda tabla expuesta debe tener RLS habilitado.

No se permitirá:

- tabla expuesta sin RLS;
- política `using (true)` sin justificación;
- acceso total para `authenticated`;
- desactivar RLS para corregir errores.

## 14.2 Matriz mínima

### Cliente

Puede:

- leer y editar su perfil;
- administrar sus direcciones;
- leer sus reservas;
- crear borradores autorizados;
- participar en sus chats;
- crear reseña de una reserva completada;
- crear disputa propia.

### Profesional

Puede:

- leer y editar su perfil profesional;
- administrar servicios propios;
- administrar disponibilidad;
- leer reservas asignadas;
- actualizar solo estados permitidos;
- participar en chats asignados;
- leer liquidaciones propias.

### Administrador

Acceso mediante backend seguro.

No usar `service_role` en frontend.

## 14.3 Documento obligatorio

OpenCode debe crear:

```text
docs/RLS_MATRIX.md
```

Debe detallar por tabla:

- SELECT;
- INSERT;
- UPDATE;
- DELETE;
- rol;
- condición `USING`;
- condición `WITH CHECK`;
- riesgos;
- pruebas.

---

# 15. CLAVES Y SECRETOS

## 15.1 Variables públicas permitidas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## 15.2 Secretos prohibidos en navegador

```text
SUPABASE_SECRET_KEY
service_role
JWT secret
database password
payment secret
webhook secret
SMTP password
admin credentials
private API keys
```

## 15.3 Reglas

- `.env*` en `.gitignore`;
- crear `.env.example` sin valores reales;
- no imprimir secretos;
- no incluir secretos en URL;
- no pegar secretos en documentación;
- rotar inmediatamente si se exponen;
- almacenar secretos en Supabase Secrets o proveedor de despliegue;
- sanitizar logs.

---

# 16. ALMACENAMIENTO DE ARCHIVOS

## 16.1 Buckets recomendados

```text
public-assets
professional-avatars
professional-documents
booking-attachments
dispute-evidence
message-attachments
```

## 16.2 Reglas

- documentos sensibles en buckets privados;
- URLs firmadas;
- expiración;
- límites de tamaño;
- allowlist MIME;
- nombre interno UUID;
- no confiar en extensión;
- no usar nombre original como ruta;
- políticas Storage RLS;
- preparación para análisis antivirus antes de producción.

---

# 17. SEGURIDAD DE PAGOS

Los pagos reales no se habilitarán hasta validar proveedor y modelo legal.

## 17.1 Regla principal

El navegador nunca define:

- subtotal;
- descuento;
- comisión;
- impuestos;
- monto total;
- monto profesional;
- estado del pago.

## 17.2 Flujo

```text
Cliente solicita pago
→ Backend recalcula precio
→ Backend crea operación
→ Proveedor procesa
→ Proveedor envía webhook
→ Edge Function verifica firma
→ Base actualiza estado
→ Frontend consulta resultado
```

## 17.3 Controles

- idempotency key;
- webhook firmado;
- referencia interna;
- referencia externa;
- monto esperado;
- moneda;
- auditoría;
- conciliación;
- reintentos seguros;
- no confiar en redirect del navegador;
- no almacenar datos completos de tarjeta.

---

# 18. DISPONIBILIDAD Y CONCURRENCIA

La base debe impedir dobles reservas.

No basta con validar en UI.

Debe existir:

- transacción;
- bloqueo lógico o restricción;
- comprobación final en base;
- manejo de concurrencia;
- respuesta clara al usuario;
- reintento controlado.

La creación de reserva deberá ser atómica:

```text
validar profesional
validar servicio
validar zona
validar horario
validar precio
bloquear horario
crear reserva
crear snapshot
registrar auditoría
```

Todo se confirma o todo se revierte.

---

# 19. IDEMPOTENCIA

Obligatoria en:

- creación de reserva;
- confirmación de pago;
- reembolso;
- cambio de estado crítico;
- liquidación;
- webhooks;
- notificaciones sensibles.

Cada operación deberá aceptar o generar una clave única.

No se deben crear duplicados por:

- doble clic;
- refresco;
- reintento;
- timeout;
- webhook repetido.

---

# 20. AUDITORÍA

Registrar:

- usuario;
- rol;
- acción;
- entidad;
- identificador;
- estado anterior;
- estado nuevo;
- fecha UTC;
- origen;
- request id;
- resultado.

Nunca registrar:

- contraseña;
- token completo;
- número completo de tarjeta;
- secreto;
- documento sensible sin necesidad.

---

# 21. LIBRERÍAS GRATUITAS AUTORIZADAS

## 21.1 Frontend

| Necesidad | Librería |
|---|---|
| Framework | Next.js |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Supabase | `@supabase/supabase-js` |
| Supabase SSR | `@supabase/ssr` |
| Formularios | React Hook Form |
| Validación | Zod |
| Iconos | Lucide React |
| Consultas complejas | TanStack Query, solo si se justifica |
| Unit tests | Vitest |
| UI tests | Testing Library |
| E2E | Playwright |
| Lint | ESLint |
| Formato | Prettier |

## 21.2 Backend Supabase

| Necesidad | Herramienta |
|---|---|
| Base de datos | PostgreSQL |
| Migraciones | Supabase CLI |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| HTTP protegido | Edge Functions |
| Lógica transaccional | PostgreSQL Functions |
| Pruebas SQL | pgTAP |
| Runtime Functions | Deno |

## 21.3 Licencias permitidas

- MIT;
- Apache-2.0;
- BSD-2-Clause;
- BSD-3-Clause;
- ISC;
- PostgreSQL License.

Cualquier otra licencia requiere aprobación.

---

# 22. POLÍTICA DE DEPENDENCIAS

OpenCode no podrá:

- instalar paquetes abandonados;
- duplicar librerías;
- usar paquetes sin repositorio verificable;
- instalar componentes premium;
- usar templates pagados;
- fijar versiones como `latest` sin lockfile;
- ignorar vulnerabilidades críticas;
- copiar snippets sin fuente;
- agregar scripts de instalación desconocidos.

Archivos obligatorios:

```text
docs/DEPENDENCY_POLICY.md
docs/THIRD_PARTY_LICENSES.md
docs/SECURITY_AUDIT.md
```

---

# 23. VULNERABILIDADES A CONTROLAR

## 23.1 Acceso

- IDOR;
- escalamiento de privilegios;
- falta de RLS;
- roles manipulables;
- acceso administrativo desde frontend;
- lectura masiva;
- exposición de vistas.

## 23.2 Inyección

- SQL injection;
- XSS;
- HTML no sanitizado;
- comandos en archivos;
- path traversal;
- mass assignment.

## 23.3 Autenticación

- fuerza bruta;
- enumeración de usuarios;
- sesiones no revocadas;
- recuperación insegura;
- falta de MFA;
- redirecciones abiertas.

## 23.4 Pagos

- modificación de total;
- doble cobro;
- webhook falso;
- replay;
- reembolso duplicado;
- estado manipulado.

## 23.5 Archivos

- MIME falso;
- archivo ejecutable;
- documento público;
- nombre malicioso;
- tamaño excesivo;
- acceso permanente.

## 23.6 Dependencias

- paquete abandonado;
- paquete malicioso;
- versión vulnerable;
- licencia incompatible;
- script de postinstall sospechoso.

## 23.7 Infraestructura

- secretos en Git;
- logs sensibles;
- entornos mezclados;
- producción usada para pruebas;
- migraciones destructivas;
- backups inexistentes.

---

# 24. CABECERAS Y SEGURIDAD WEB

Configurar:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- frame-ancestors;
- HSTS cuando corresponda;
- cookies seguras;
- `SameSite`;
- `HttpOnly` cuando aplique;
- redirecciones controladas.

La CSP debe permitir únicamente dominios requeridos.

---

# 25. ENTORNOS

Obligatorios:

```text
LOCAL
DEVELOPMENT
STAGING
PRODUCTION
```

Cada entorno debe tener:

- proyecto Supabase independiente;
- claves independientes;
- datos independientes;
- buckets independientes;
- dominio independiente;
- secretos independientes;
- pagos sandbox o producción;
- migraciones controladas.

Nunca:

- usar producción para probar;
- copiar datos reales a desarrollo;
- compartir credenciales;
- ejecutar seeds destructivos en producción.

---

# 26. ESTRUCTURA DEL REPOSITORIO

```text
resuelto/
├── apps/
│   └── web/
│       ├── src/
│       ├── public/
│       └── tests/
├── packages/
│   ├── ui/
│   ├── validation/
│   ├── types/
│   ├── config/
│   └── testing/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── tests/
│   ├── seed.sql
│   └── config.toml
├── docs/
│   ├── BRAND_BOOK_RESUELTO.md
│   ├── DOCUMENTO_FUNCIONAL_TECNICO_RESUELTO.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── API_CONTRACTS.md
│   ├── RLS_MATRIX.md
│   ├── THREAT_MODEL.md
│   ├── SECURITY.md
│   ├── BOOKING_STATE_MACHINE.md
│   ├── PAYMENT_SECURITY.md
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── DEPENDENCY_POLICY.md
│   ├── THIRD_PARTY_LICENSES.md
│   └── RUNBOOK.md
├── .github/
│   └── workflows/
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

# 27. REQUISITOS NO FUNCIONALES

## 27.1 Rendimiento

- Core Web Vitals aceptables;
- paginación;
- carga progresiva;
- imágenes optimizadas;
- queries indexadas;
- evitar N+1;
- caché solo donde sea segura;
- no bloquear UI innecesariamente.

## 27.2 Disponibilidad

- errores controlados;
- reintentos;
- estados vacíos;
- fallback;
- monitoreo;
- logs;
- backups.

## 27.3 Escalabilidad

- monolito modular;
- funciones separadas por dominio;
- lógica crítica en base;
- dependencias desacopladas;
- migraciones versionadas;
- preparación para apps móviles.

## 27.4 Mantenibilidad

- TypeScript estricto;
- componentes reutilizables;
- validación centralizada;
- documentación;
- tests;
- convenciones;
- cero duplicación innecesaria.

## 27.5 Accesibilidad

- WCAG 2.1 AA;
- teclado;
- foco visible;
- labels;
- contraste;
- mensajes de error claros;
- áreas táctiles adecuadas;
- `aria-live`;
- headings correctos.

---

# 28. PRUEBAS OBLIGATORIAS

## 28.1 Unitarias

- cálculos;
- validaciones;
- transición de estados;
- comisiones;
- cancelaciones;
- permisos.

## 28.2 Integración

- Auth;
- RLS;
- Storage;
- creación de reserva;
- disponibilidad;
- funciones SQL;
- Edge Functions;
- webhooks simulados.

## 28.3 E2E

- registro cliente;
- login;
- búsqueda;
- perfil;
- reserva;
- cancelación;
- registro profesional;
- aprobación;
- aceptación;
- finalización;
- reseña;
- disputa.

## 28.4 Seguridad

- usuario A no lee datos de usuario B;
- profesional no edita otra reserva;
- cliente no cambia precio;
- usuario no cambia rol;
- bucket privado no es público;
- función rechaza token inválido;
- webhook rechaza firma incorrecta;
- doble operación no duplica datos.

---

# 29. CI/CD

El pipeline debe ejecutar:

```text
install
license validation
secret scan
lint
typecheck
unit tests
integration tests
RLS tests
build
dependency audit
migration validation
E2E
deployment
post-deployment smoke test
```

Debe bloquear despliegue ante:

- error de tipos;
- test fallido;
- secreto detectado;
- vulnerabilidad crítica;
- migración inválida;
- tabla expuesta sin RLS;
- build fallido.

---

# 30. DESPLIEGUE

## 30.1 Frontend

Preparado para Vercel o plataforma equivalente con plan inicial gratuito.

## 30.2 Backend

Supabase:

- Database;
- Auth;
- Storage;
- Realtime;
- Edge Functions.

## 30.3 Consideración de costos

Las librerías deben ser gratuitas.

La infraestructura puede generar costos cuando:

- aumente tráfico;
- aumente almacenamiento;
- aumente correo;
- aumenten funciones;
- se habiliten pagos;
- se necesite proveedor SMTP;
- se necesiten mapas;
- se necesite WhatsApp o SMS.

OpenCode debe diferenciar siempre:

- librería gratuita;
- servicio gratuito con límites;
- servicio pago;
- costo futuro probable.

---

# 31. DOCUMENTOS QUE OPENCODE DEBE ENTREGAR ANTES DE PROGRAMAR

1. `ARCHITECTURE.md`
2. `DATA_MODEL.md`
3. `API_CONTRACTS.md`
4. `RLS_MATRIX.md`
5. `THREAT_MODEL.md`
6. `SECURITY.md`
7. `BOOKING_STATE_MACHINE.md`
8. `PAYMENT_SECURITY.md`
9. `ENVIRONMENT_VARIABLES.md`
10. `DEPENDENCY_POLICY.md`
11. `THIRD_PARTY_LICENSES.md`
12. `RUNBOOK.md`

---

# 32. DECISIONES QUE REQUIEREN APROBACIÓN

OpenCode debe detenerse y preguntar antes de:

- elegir proveedor de pagos;
- elegir proveedor SMTP;
- usar mapas pagos;
- introducir una nueva librería;
- usar `SECURITY DEFINER`;
- crear acceso administrativo;
- cambiar modelo de comisión;
- cambiar estados;
- eliminar tabla;
- borrar datos;
- modificar RLS;
- usar una licencia no aprobada;
- publicar producción;
- conectar secretos;
- ejecutar migración destructiva.

---

# 33. CRITERIOS DE ACEPTACIÓN DEL MVP

El MVP se considera funcional cuando:

## Cliente

- puede registrarse;
- puede confirmar correo;
- puede iniciar sesión;
- puede buscar;
- puede comparar;
- puede ver profesional;
- puede elegir horario;
- puede crear reserva;
- puede ver estado;
- puede cancelar;
- puede chatear;
- puede confirmar finalización;
- puede calificar.

## Profesional

- puede crear perfil;
- puede elegir servicios;
- puede definir tarifas;
- puede configurar zonas;
- puede configurar agenda;
- puede enviar revisión;
- puede recibir reserva;
- puede aceptar;
- puede actualizar estados permitidos;
- puede ver ingresos simulados;
- puede leer reseñas.

## Administrador

- puede aprobar profesional;
- puede gestionar categorías;
- puede revisar reservas;
- puede revisar disputas;
- puede suspender cuentas;
- puede consultar auditoría.

## Seguridad

- RLS activo;
- claves privadas no expuestas;
- roles no manipulables;
- operaciones críticas protegidas;
- auditoría activa;
- tests de aislamiento aprobados;
- archivos sensibles privados;
- dependencias auditadas.

---

# 34. PLAN DE IMPLEMENTACIÓN PROPUESTO

## Etapa 0 — Documentación

- arquitectura;
- datos;
- seguridad;
- RLS;
- estados;
- contratos;
- dependencias.

## Etapa 1 — Base del proyecto

- monorepo;
- Next.js;
- Tailwind;
- design system;
- Supabase local;
- Auth;
- entornos;
- CI.

## Etapa 2 — Catálogo y perfiles

- categorías;
- servicios;
- perfiles;
- profesionales;
- documentos;
- Storage.

## Etapa 3 — Disponibilidad y búsqueda

- zonas;
- agenda;
- excepciones;
- filtros;
- perfiles públicos.

## Etapa 4 — Reservas

- creación;
- snapshot;
- estados;
- cancelaciones;
- auditoría.

## Etapa 5 — Mensajería y reseñas

- conversaciones;
- realtime;
- adjuntos;
- reseñas;
- moderación.

## Etapa 6 — Administración

- revisión profesional;
- categorías;
- reservas;
- disputas;
- auditoría.

## Etapa 7 — Pagos simulados

- interfaz de proveedor;
- idempotencia;
- webhooks simulados;
- pagos y reembolsos simulados.

## Etapa 8 — Hardening

- pruebas;
- threat model;
- seguridad;
- performance;
- accesibilidad;
- auditoría de dependencias;
- staging.

---

# 35. RESPUESTA QUE OPENCODE DEBE ENTREGAR AHORA

OpenCode no debe escribir código todavía.

Debe responder con:

1. Confirmación de lectura completa.
2. Resumen de arquitectura entendida.
3. Mapa de módulos.
4. Modelo de datos propuesto.
5. Matriz preliminar de roles y permisos.
6. Lista de funciones SQL previstas.
7. Lista de Edge Functions previstas.
8. Variables de entorno públicas y privadas.
9. Dependencias propuestas, licencia y motivo.
10. Riesgos técnicos.
11. Riesgos de seguridad.
12. Decisiones funcionales pendientes.
13. Plan de implementación por etapas.
14. Lista exacta de archivos que creará.
15. Contradicciones detectadas entre este documento y el Brand Book.

No debe crear tablas, código, migraciones ni despliegues hasta recibir aprobación.

---

# 36. PROMPT DE ENTREGA PARA OPENCODE

Usar exactamente este mensaje:

```text
Lee completamente estos archivos:

1. docs/BRAND_BOOK_RESUELTO.md
2. docs/DOCUMENTO_FUNCIONAL_TECNICO_RESUELTO.md

Ambos documentos son obligatorios y representan la fuente única de verdad del proyecto Resuelto.

No escribas código todavía.

Primero entrega:

1. Confirmación de lectura completa.
2. Resumen de la arquitectura.
3. Mapa de módulos.
4. Modelo de datos preliminar.
5. Matriz de roles y permisos.
6. Funciones PostgreSQL previstas.
7. Edge Functions previstas.
8. Variables de entorno públicas y privadas.
9. Dependencias propuestas con licencia y justificación.
10. Riesgos funcionales, técnicos y de seguridad.
11. Decisiones pendientes.
12. Plan de implementación.
13. Archivos que crearás.
14. Contradicciones detectadas.

Reglas obligatorias:

- No modificar KenjiPocket.
- Crear un proyecto independiente.
- Solo librerías gratuitas y open source.
- No usar service_role en frontend.
- No exponer secretos.
- No desactivar RLS.
- No copiar código, diseño, textos ni recursos de Webel.
- No ejecutar migraciones.
- No publicar.
- No agregar dependencias sin aprobación.
- No usar SECURITY DEFINER sin justificarlo.
- No iniciar desarrollo hasta que yo apruebe el plan.
```
