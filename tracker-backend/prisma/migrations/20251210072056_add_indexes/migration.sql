-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");

-- CreateIndex
CREATE INDEX "Topic_subcategoryId_idx" ON "Topic"("subcategoryId");

-- CreateIndex
CREATE INDEX "Topic_title_idx" ON "Topic"("title");
