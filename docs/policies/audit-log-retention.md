# Retenção de Audit Log

- **Log quente (Banco Transacional):** 3 meses.
- **Log morno (Data Warehouse/S3 Indexado):** 1 ano.
- **Log frio (Archive):** 5 anos (atendendo à maioria dos requisitos regulatórios da ANS e correlatos brasileiros em saúde).
O Purge limpa os dados permanentemente aos 5 anos mais 1 dia via cron.
