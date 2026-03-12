# Análise de Risco de Migração (Dados Órfãos)

Se durante o script de migração de IDs houver erro (OOM, lock database):
- Foreign Keys quebrados podem ficar "isolados".
- Se um RLS tentar amarrar um ID num sub-relacionamento que deu erro de sincronia, ocorrerá uma anomalia em que os dados desaparecem aos olhos dos donos das organizações.
- **Mitigação:** Processo massivo roda dentro de única Transação Transacional atômica ou processamento atrelado a Batches rastreáveis que fazem self-healing na repetição, evitando blocos deixados pela metade que causam órfãos em views RLS limitadas.
