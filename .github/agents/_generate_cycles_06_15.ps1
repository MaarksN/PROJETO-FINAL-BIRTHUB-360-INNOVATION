$ErrorActionPreference = 'Stop'

$repo = 'c:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION'
$agentsRoot = Join-Path $repo '.github\agents'

$cycles = [ordered]@{
  '06' = @('DemoSandboxer','SecurityQuestionnaireFiller','ArchitectureDiagrammer','TechObjectionResolver','PoCTracker','ValueAligner','UseCaseGenerator','ROIScenarioModeler','TechStackAuditor','ExecutiveDemoCurator','PipelineInspector','OneOnOnePrep','DealAtRiskAlerter','WinLossAnalyzer','DiscountLeakGuard','MarketExpansionModeler','QuotaSetter','CompPlanCalculator','LeaderboardBroadcaster','StrategicAllianceScout')
  '07' = @('ABTestAutomator','ViralLoopTracker','ActivationOptimizer','CACLTVModeler','AdCopyMachine','LandingPageMorpher','WebinarPromoter','LeadMagnetCreator','CampaignOrchestrator','BattlecardUpdater','ReleaseNoteWriter','PositioningTester','PersonaSync','LaunchPlanner','BidAutoAdjuster','KeywordOpportunitySpotter','AdFatigueMonitor','CreativeAssetTester','ROASMaximizer','TopicClusterPlanner','SEODraftWriter','PlagiarismToneChecker')
  '08' = @('ContentRepurposer','DistributionAutomator','SubjectLineTester','ChurnWinBackSequencer','DripCampaignTrigger','NewsletterCurator','UnsubscribePredictor','MarTechSync','DataHygieneMonitor','UTMBuilderBot','LeadRoutingTroubleshooter','DashboardAutomator','BacklinkScouter','OnPageOptimizer','CannibalizationDetector','SERPVolatilityTracker','SchemaMarkupGenerator','BrandGuidelineEnforcer','PRScraper','SentimentShiftAlerter','InfluencerVettor','CrisisCommsDrafter')
  '09' = @('QBRDeckBuilder','HealthScoreTrigger','UpsellPrompt','BestPracticeRecommender','ExecutiveSponsorTracker','ProjectPlanTracker','APIKeyConfigurator','DataMigrationValidator','MilestoneChaser','DelayEscalator','WelcomeSequencer','AhaMomentTracker','TrainingVideoRecommender','FAQAutoResponder','AdoptionMetricAnalyzer','TicketClassifier','SemanticSearchKB','L1AutoResolver','L3BugReplicator','AngryCustomerEscalator','SLAMonitor','PatchUpdateAlerter','ScalabilityPredictor','CustomScriptGenerator','OutageCommunicator','RenewalContractGenerator','CrossSellMapper','RelationshipMatrixBuilder','PricingTierRecommender','WhiteSpaceAnalyzer','CSATNPSAggregator','TicketBacklogAnalyzer','KBGapIdentifier','ShiftScheduler','RefundProcessor')
  '10' = @('FunnelLeakDetector','DataSiloBridger','ToolROIAnalyzer','GTMAlignmentScorer','ProcessBottleneckAlerter','Mapeia','CRMCleanser','TerritoryBalancer','QuotaAttainmentTracker','ValidationRuleEnforcer','DuplicateMerger','MicroLearningCreator','VoicePitchGrader','PlaybookUpdater','CompetitorIntelBroadcaster','OnboardingRampTracker','MarginCalculator','NonStandardFlag','DiscountWaterfallModeler','LegalClauseMatcher','ApprovalWorkflowRouter','APIIntegrationBuilder','LeadScoringModeler','WebhookMonitor','CustomCRMUIBuilder','DataEnrichmentAutomator','CohortAnalyzer','ForecastingModeler','PriceDiscountImpact','ChannelAttritionPredictor','ACVGrowthTracker')
  '11' = @('RequirementsGatherer','ProcessFlowMapper','UserStoryWriter','StakeholderUpdateAutomator','ScopeCreepDetector','SQLQueryGenerator','AnomalyDetector','DashboardAutoFreshener','DataCleaningBot','StatSignificanceTester','ARRBridgeBuilder','NetRetentionModeler','ChurnCohortIsolator','PricingElasticityTester','PipelineVelocityTracker','JourneyDropOffLocator','FeatureHeatmapper','ABTestSynthesizer','StickinessTracker','SessionReplaySummarizer','MarketShareEstimator','MacroFactorTracker','CompetitorFinancialScraper','StrategicKPIAggregator','GeospatialExpansionMapper','AttributionModeler','MediaMixOptimizer','CampaignDecayPredictor','AudienceSegmentDiscoverer','LTVbyChannelCalculator')
  '12' = @('ContractRedliner','IPInfringementScraper','RegulatoryChangeAlerter','NDAAutoSigner','RiskExposureQuantifier','InvoiceGenerator','ProrationCalculator','FailedPaymentRetrier','TaxExemptionVerifier','DisputedChargeAggregator','DunningAutomator','PaymentPlanNegotiator','PromiseToPayTracker','BadDebtPredictor','CollectionAgencyRouter','CloudSpendOptimizer','SaaSLicenseAuditor','InstanceRightSizer')
  '13' = @('BudgetVariancePinger','MultiCloudCostModeler','CashAppMatcher','BankReconciliationBot','AgingReportSender','CreditHoldReleaser','RemittanceExtractor','CreditScoreFetcher','FinancialRatioCalculator','CreditLimitRecommender','BankruptcyRiskMonitor','TradeReferenceChecker','MonthEndCloseAutomator','AccrualEngine','AuditTrailBuilder','GLAnomalyDetector','ComplianceChecklistEnforcer')
  '14' = @('PolicyMappingBot','RegulatoryTrainingTracker','SanctionsScreener','CommsSurveillanceBot','AuditPrepEngine','SARDrafter','TransactionLinkAnalyzer','MoneyMuleDetector','HighRiskJurisdictionPinger','CryptoTracingBot','IDVerificationMatcher','LivenessCheckAnalyzer','UBOMapper','AddressProofValidator','PEPScreener','ChargebackDisputeAutomator','VelocityRuleEngine','SyntheticIdentityDetector')
  '15' = @('DeviceFingerprintMatcher','AltDataScorer','DefaultProbabilityModeler','AutoDecisionEngine','LimitDecreaseRecommender','CentralBankXMLGenerator','CapitalAdequacyCalculator','LiquidityRatioMonitor','DeadlineTracker','StressTestModeler','ProcessWalkthroughAutomator','AccessRightAuditor','RemediationPlanTracker','TransactionHoldReviewer','SLAEscalator','FalsePositiveReducer','CapacityModeler','IncidentPostMortemDrafter')
}

function Convert-ToKebabCase {
  param([string]$Name)

  $normalized = ($Name -replace '\s+', '')
  $step1 = $normalized -replace '([a-z0-9])([A-Z])', '$1-$2'
  $step2 = $step1 -replace '([A-Z]+)([A-Z][a-z])', '$1-$2'
  return $step2.ToLower()
}

foreach ($entry in $cycles.GetEnumerator()) {
  $cycle = $entry.Key
  $names = $entry.Value
  $cycleDir = Join-Path $agentsRoot ("cycle-{0}" -f $cycle)
  New-Item -Path $cycleDir -ItemType Directory -Force | Out-Null

  foreach ($name in $names) {
    $slug = Convert-ToKebabCase $name
    $agentPath = Join-Path $cycleDir ("{0}.agent.md" -f $slug)

    $agentContent = @"
---
name: "$name Agent"
description: "Use when structuring $name analysis, decisions, and execution plans with actionable outputs."
tools: [read, search]
user-invocable: true
---
Você é especialista em $name.

## Escopo
- Estruturar análises e decisões relacionadas a $name.
- Transformar objetivos em plano de ação com prioridades claras.

## Restrições
- NÃO responder sem contexto mínimo do problema.
- NÃO produzir recomendações genéricas sem critérios de priorização.

## Saída Obrigatória
1. Diagnóstico do cenário
2. Plano de ação priorizado
3. Métricas de acompanhamento
"@

    Set-Content -Path $agentPath -Value $agentContent -Encoding UTF8
  }

  $orderLines = for ($i = 0; $i -lt $names.Count; $i++) {
    "{0}. {1}" -f ($i + 1), $names[$i]
  }

  $readmeContent = @"
# Cycle $cycle — Lote de Agentes

Este diretório contém os $($names.Count) agentes do ciclo $([int]$cycle).

## Escopo do lote
- Total previsto no checklist: $($names.Count) nomes
- Implantados neste lote: $($names.Count) agentes
- Sem pendências neste ciclo

## Ordem dos agentes criados
$($orderLines -join "`n")

## Padrão aplicado
- Frontmatter com name, description, tools, user-invocable
- description no padrão de descoberta "Use when..."
- Corpo com Escopo, Restrições, Saída Obrigatória
"@

  $readmePath = Join-Path $cycleDir 'README.md'
  Set-Content -Path $readmePath -Value $readmeContent -Encoding UTF8
}

$summary = foreach ($entry in $cycles.GetEnumerator()) {
  $cycleDir = Join-Path $agentsRoot ("cycle-{0}" -f $entry.Key)
  $agentCount = (Get-ChildItem -Path $cycleDir -Filter '*.agent.md' -File).Count

  [PSCustomObject]@{
    Cycle = "cycle-$($entry.Key)"
    Expected = $entry.Value.Count
    AgentFiles = $agentCount
    Readme = Test-Path (Join-Path $cycleDir 'README.md')
  }
}

$summary | Format-Table -AutoSize