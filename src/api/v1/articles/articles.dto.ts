/**
 * An interface which describes a record in the `articles` table in the database.
 *
 * Articles contain the information for viewable content in REST.
 *
 * The property names/types of this interface must reflect what is present in the SQL database.
 */
export interface Article {
    /**
     * Article ID of the article. This is the primary key on the SQL server, and is stored as a UUID.
     */
    article_id: string,

    /**
     * Title of the article.
     */
    title: string,

    /**
     * Popularity of the article, i.e. how often the article is accessed.
     * @notimplemented
     */
    popularity: number,

    /**
     * The date that the article was submitted.
     */
    submitted_date: Date,

    /**
     * A description of the article.
     */
    description?: string,

    /**
     * Whether the article should appear in search results or not.
     */
    deindex: boolean
}

/**
 * An interface which describes revision numbers/contents/approvals for each article submission.
 *
 * An `Article` consists of two pieces, the `Article` quote-unquote *"header"*, and the `ArticleRevision`.
 *
 * The property names/types of this interface must reflect what is present in the SQL database.
 */
export interface ArticleRevision {
    /**
     * A foreign key to the article that this revision references.
     */
    article_id: string,

    /**
     * The numbered revision of the article.
     */
    revision_number: number,

    /**
     * The name of the file that the content for the current article revision lies at.
     */
    file_name: string,

    /**
     * Whether this revision is approved or not.
     */
    approved: boolean,

    /**
     * The date this revision was submitted.
     */
    revision_date: Date,

    /**
     * The author who created the revision.
     */
    author_id: string
}